# JMC Platform — Content Management Code Review

**Repo:** `KizioTech/JMC` · **Stack:** React 18 + Vite + TypeScript, Tailwind, shadcn/ui, Supabase (Postgres + Auth + RLS), TanStack Query, react-router-dom
**Reviewed:** full clone, every source file under `src/`, `supabase/migrations/`, and `scripts/`.

This document is organized by layer (database → services → admin → student → cross‑cutting), and inside each layer, file by file. Every claim below was verified by reading the actual source in this repo — not guessed — so file paths and line-level behavior are exact as of this clone.

---

## 0. Executive summary

The app has clearly been mid-migration: it started as a static site (`public/content/**/*.md`, hardcoded PDFs) and is partway through becoming a real Supabase-backed CMS. That migration is **inconsistent** — some pages (Library, Courses, NotePage) are fully wired to the database; others (site search, student dashboard, four entire admin sections) are still stubs or still pointed at the old static-file world. The result is a content pipeline where an admin can create and publish a note perfectly well, but a student searching for it, or an admin trying to manage quizzes/media/courses/subjects, hits dead ends.

**Highest-impact findings** (all verified in code, detailed below):

1. **Global search is completely disconnected from the database.** `Navbar.tsx` calls `searchContent()`, a legacy function in `searchService.ts` that fetches markdown files from `/content/notes/...` — a folder that no longer exists in `public/`. It will silently return zero dynamic results in production, and even its static fallback entries link to routes like `/notes/hyperbolic-functions` that don't match the app's real route scheme (`/notes/:subject/:slug`). There is a working DB-backed function, `searchContentDB()`, sitting unused in the same file — and even *that* constructs broken URLs (see §2.4).
2. **Four of eight admin content sections are literal placeholders**: `CoursesManager`, `MediaManager`, `QuizzesManager`, `SubjectsManager` each render only `<div>… Coming Soon</div>`. There is no UI path to create a subject, quiz, course, or media asset — despite full database tables and RLS policies existing for all four (§3).
3. **Several primary admin call-to-actions are dead links.** `AdminDashboard`'s "Create New Note" / "Add Tutorial" buttons point at `/admin/notes/new` and `/admin/tutorials/new`, which are not registered routes (§3.2). The "Edit" button on the dashboard's recent-activity feed links to `/admin/notes/{id}` (missing `/edit`). The student dashboard sidebar links to seven `/dashboard/...` sub-routes, of which only `/dashboard` itself actually exists (§4.4).
4. **The note editor route (`/admin/notes/:id/edit`) is not protected by the admin auth guard**, and its `select('*')` can expose a published note's *unpublished draft* fields (`draft_content_md`, `draft_title`) to any anonymous visitor, because Row Level Security only checks `published = true`, not editor authentication (§3.3, §5.1). This is a real content-leak risk, not just a UX gap.
5. **Content-linking features exist in the DB and admin UI but are never read by the student-facing pages** — `notes.previous_note_id` / `next_note_id` are fully wired up in `NoteRelationsPanel` (dropdowns, mutations, DB columns) but `NotePage.tsx` computes prev/next navigation a completely different way (array index within `sort_order`), so setting them does nothing (§4.1, §3.5).
6. **Two independent, drifted markdown renderers** (`MarkdownRenderer.tsx` for notes, `TutorialRenderer.tsx` for tutorials) duplicate ~700 lines of near-identical ReactMarkdown/KaTeX setup, but support *different* feature sets — notes get Definition/Theorem/Example callout boxes and video embeds; tutorials get a `:::question / :::solution` toggle block that notes can't use. Content authors have to remember which syntax works on which page (§4.7, §4.9).
7. **Image/media insertion has no connection to the `media_assets` table.** The rich text editor's "Insert Image" is a raw URL paste field; there's a `media_assets` table and a `MediaManager` nav item, but `MediaManager` is a stub, so authors have nowhere to actually upload anything — they must host images elsewhere first (§3.7).
8. **`course_progress` (student progress tracking) is never read or written anywhere in the codebase.** The student dashboard's "Recent Activity" is a permanently hardcoded empty state, not a query (§4.4).

Everything below expands on this, file by file, with what to change.

---

## 1. Database layer — `supabase/migrations/`

| File | What it does | Issues / improvements |
|---|---|---|
| `20260702000000_initial_schema.sql` | Core tables: `subjects`, `notes`, `tutorials`, `quizzes` + `quiz_questions`, `courses` + `course_modules`, `profiles`, `course_progress`; full-text search via generated `tsvector` columns and `search_notes`/`search_tutorials` RPCs; RLS policies for public-read/admin-write. | Solid foundation. Two gaps: (a) `course_progress` has no application code writing to it anywhere (§4.4) — it's schema without a feature; (b) the `search_notes`/`search_tutorials` RPCs return `slug` but not the parent subject's slug, which is exactly why the DB-backed search produces broken URLs downstream (§2.4) — this should be fixed at the RPC level (join `subjects.slug` in, return it) rather than patched in the client. |
| `20260702000001_subjects_rls.sql` | Adds RLS to `subjects` (public read, admin write). | Fine. Note this migration had to be added *after* the fact — `subjects` was originally created without RLS enabled in the initial migration, which for a few deploys would have meant "subjects" was either fully open or fully blocked depending on Postgres defaults. Not a live bug now, just a sign migrations aren't being planned atomically. |
| `20260702000002_grant_permissions.sql` | Blanket `grant all ... to anon, authenticated, service_role` on all tables/sequences/routines, plus default privileges for future tables. | This is broader than it needs to be. Table-level `GRANT ALL` combined with RLS is *usually* safe because RLS still filters rows, but it means **RLS is the only thing standing between `anon` and full write access** to every table, including ones added later that might forget an RLS policy (the "grant all to future tables" line makes that failure mode automatic and silent). Recommend narrowing this to `SELECT` for `anon`, and `SELECT/INSERT/UPDATE/DELETE` for `authenticated`, then letting RLS do the row-level restriction — so a missing/buggy policy fails closed instead of open. |
| `20260702000003_media_assets.sql` | Creates `media_assets` (image/video/document rows), RLS, and adds `description/difficulty/duration_text/rating/topics` to `tutorials` and `courses`. | The table this migration creates is the one `MediaManager.tsx` should be built against — right now it's unused (§3.7). |
| `20260703000000_note_series_links.sql` | Adds `previous_note_id`/`next_note_id` to `notes`. | **Dead columns** — written by `NoteRelationsPanel`, never read by any student-facing page (§0.5, §3.5, §4.1). Either wire `NotePage.tsx` to actually use these for prev/next, or remove the feature; right now it's a trap where an admin sets "next note" and nothing visibly changes. |
| `20260704000000_note_drafts.sql` | Adds `draft_content_md`/`draft_title`/`draft_saved_at`/`published_at` to both `notes` and `tutorials`, backfills existing rows. | Good feature (autosave drafts, §3.3) but the RLS model wasn't updated alongside it — the public-read policy (`published = true`) doesn't distinguish `content_md` from `draft_content_md`, so once a note is published, its live draft edits are publicly selectable by column, not just by row (§5.1). Needs either a Postgres view that only exposes the published columns to `anon`, or application-level column allow-listing (which is what `contentService.ts` was probably meant to do, see §2.1). |
| `20260705000000_add_cover_image.sql` | Adds `cover_image` + `difficulty` to `notes`, `cover_image` to `tutorials`. | The columns exist, but `contentService.getNoteBySlug` (and every other note query) doesn't select them (§2.1) — so this migration's columns are populated in the DB (via `NoteEditorPage` if a field existed for them, though currently no UI sets `cover_image` either — see §3.3) but silently dropped before they ever reach a page. |

**Net recommendation for this layer:** add one more migration that (a) tightens the blanket grants, (b) either drops `previous_note_id`/`next_note_id` or hooks them up, and (c) adds an RPC/view for "public note fields only" so drafts of published notes stop being world-readable.

---

## 2. Services layer — `src/services/`

### 2.1 `contentService.ts`
Central data-access layer for subjects/notes/tutorials. Read-only — no create/update/delete functions live here at all (those are done ad hoc, inline, in admin components — see §3).

- **Bug:** none of `getAllNotes`, `getAllAdminNotes`, `getNotesForSubject`, or `getNoteBySlug` select `difficulty`, `cover_image`, or (for `getNoteBySlug` specifically) `updated_at`. `NoteRow`/`NoteWithContent` declare these fields in TypeScript, so the compiler is happy, but at runtime they come back `undefined`. This is exactly why a note's difficulty badge / hero image / "updated" date silently never render on the note detail page — the column exists (§1), the type says it exists, but the `.select()` string doesn't ask for it.
  **Fix:** add `difficulty, cover_image, updated_at` to every select string here. This single change fixes several downstream "missing badge" symptoms at once, instead of patching each page individually.
- **Missing CRUD:** every create/update/delete for notes/tutorials currently lives inline in `NotesManager.tsx`, `CreateNoteDialog.tsx`, `NoteEditorPage.tsx`, etc., each calling `supabase.from(...)` directly. That's fine for a small app, but it means there's no single place enforcing invariants (e.g., "slug must be unique before insert," "can't delete a note that's linked as a tutorial's `note_id`"). Recommend moving all writes into `contentService.ts` (`createNote`, `updateNote`, `deleteNote`, `publishNote`, same for tutorials) so admin components become thin UI over a tested service layer, and so validation/error-shaping happens in one place.
- **No pagination.** `getAllAdminNotes`/`getAllAdminTutorials` fetch every row, unfiltered, every time. Fine at current content volume; will need `.range()`-based pagination once the catalog grows past a page or two in the admin tables (§3.2, §3.6 also need this on the UI side).

### 2.2 `courseService.ts`
Read-only: `getPublishedCourses`, `getCourseBySlug`. Clean, matches the `courses`/`course_modules` schema, correctly used by `Courses.tsx` (confirmed — this page was **not** left hardcoded, unlike the migration comment "real backing for the currently-hardcoded Courses.tsx" implies was once true; that part of the migration has been completed).

- Same gap as `contentService`: no write functions, because there's nothing to call them — `CoursesManager.tsx` is a stub (§3.4). Once that page is built, its create/update/delete calls should live here, not inline in the component.

### 2.3 `quizService.ts`
Read-only: `getQuizByTutorialSlug`. Clean, correctly joins `quizzes` → `quiz_questions` → `tutorials`, sorts by `sort_order`.

- Same pattern: no write functions because `QuizzesManager.tsx` is a stub (§3.4). Right now, **the only way to create a quiz is to hand-write SQL against Supabase directly** — there is no in-app path from "I finished writing a tutorial" to "students can take a quiz on it," despite the schema fully supporting it.

### 2.4 `searchService.ts` — needs the most attention in this layer
This file contains **two entirely separate search implementations**, and the wrong one is wired up.

- `searchContent(query)` — the one actually called by `Navbar.tsx`. It searches:
  - `pages` (hardcoded array of 6 site pages — fine, low-maintenance, acceptable to hardcode) +
  - `libraryDocuments` (hardcoded array of ~9 notes/PDFs, written when the site had ~4 notes total — will not include anything created via the admin UI since the migration to Supabase) +
  - `loadDynamicContent()`, which `fetch()`es a hardcoded list of paths under `/content/notes/**.md` and `/content/tutorials/**.md`. **These paths do not exist** — `public/content/` isn't in the repo at all (only `public/assets/`). Every one of these fetches will 404 and be silently swallowed by the `catch`, so this function contributes zero results, always, in the current codebase.
  - Route construction throughout this path uses the old pre-migration scheme, e.g. `path: '/notes/hyperbolic-functions'`. The real route (per `App.tsx`) is `/notes/:subject/:slug`, e.g. `/notes/calculus/hyperbolic-functions`. Any static entry that *does* match a search term still sends the user to a URL that resolves to `NotFound`.
- `searchContentDB(query)` — correct approach (calls the real `search_notes`/`search_tutorials` Postgres RPCs, so it reflects live admin-authored content), but **is never imported or called anywhere in the app.** It also has its own bug: it builds `path: /notes/${row.slug}` — again missing the subject segment, because the RPC (§1) doesn't return the subject slug to build it from.

**Fix, concretely:**
1. In the SQL RPCs (`search_notes`/`search_tutorials`), join `subjects` and return `subject_slug` alongside `slug`.
2. In `searchContentDB`, build `path: /notes/${row.subject_slug}/${row.slug}` (and same for tutorials).
3. In `Navbar.tsx` (§4.10), swap `searchContent` → a merged function that runs `searchContentDB` (real content) + the small hardcoded `pages` array (site pages) together, ranks/interleaves them, and drops `loadDynamicContent()`/`libraryDocuments`/`pdfFiles`/`noteFiles`/`tutorialFiles`/`quizFiles` entirely — that whole static content model predates the Supabase migration and is now actively misleading (it looks like real data but isn't).
4. Decide what to do with real PDF library documents (`public/assets/pdfs/*.pdf`, ~20 files) — right now only 3 of ~20 PDFs are indexed for search at all, hardcoded. If these should stay searchable, they belong in `media_assets` (§1, §3.7) with `type = 'document'`, not as a hardcoded array in a search file.

---

## 3. Admin side — `src/pages/admin/` and `src/components/admin/`

### 3.1 `AdminLayout.tsx`
Route guard + shell for `/admin/*`. Correctly checks `session` and `role === 'admin'`, redirecting to `/auth` or `/` otherwise. This part is solid.

- **Gap:** this guard only wraps the routes nested under `<Route path="/admin" element={<AdminLayout />}>` in `App.tsx`. The full-page editors — `/admin/notes/:id/edit` and `/admin/tutorials/:id/edit` — are registered as *siblings*, outside this element, so **they have no auth guard at all** (§0.4, §5.1). Anyone with a note/tutorial UUID can load the editor UI. Combined with the RLS gap in §1, this can leak draft content of already-published items. **Fix:** either nest the editor routes under `AdminLayout` (simplest — they'd need to stop rendering `DashboardLayout`'s sidebar/chrome, which the "Full-page editors" comment in `App.tsx` suggests was the reason they were pulled out), or duplicate the `session`/`role` check at the top of `NoteEditorPage`/`TutorialEditorPage` directly.

### 3.2 `AdminDashboard.tsx`
Stats bento grid + recent activity + quick actions.

- **Broken links:** `Quick Actions` → "Create New Note" links to `/admin/notes/new`; "Add Tutorial" links to `/admin/tutorials/new`. Neither route exists (the real creation flow is the `CreateNoteDialog`/`CreateTutorialDialog` modals inside `NotesManager`/`TutorialsManager`, which insert a row and *then* redirect to `/admin/notes/:id/edit`). Clicking either quick action from the dashboard 404s. **Fix:** either register `/admin/notes/new` and `/admin/tutorials/new` as routes that open the create dialog (or auto-create a draft and redirect straight into the editor), or just change these two buttons to open the existing dialogs / navigate to `/admin/notes` and `/admin/tutorials`.
- **Broken link:** each "Recent Activity" row's Edit button links to `/admin/notes/${note.id}` — missing `/edit`. Also 404s.
- **`recentActivity` only queries `notes`**, so an admin who spends their week editing tutorials sees "No recent activity" forever. Should union recent notes + tutorials (and eventually quizzes/courses), sorted by `updated_at`.
- **Fabricated metrics:** the `trend` values (`+4%`, `+12%`, `0%`, `+2%`) are hardcoded strings, not computed from anything — they will show the same "+12% Tutorials Active" whether the platform grew or shrank. Either compute real week-over-week deltas (requires storing historical counts, e.g. a daily snapshot table or just `count(*) where created_at > now() - interval '7 days'`) or remove the trend indicators — a fake trend is worse than no trend on a dashboard admins are meant to trust.
- **`Content Coverage` %** is `min(round((notes + tutorials) * 2.5), 100)` — an arbitrary formula with no stated meaning (coverage of *what*, exactly?). This reads as filler. Replace with something concrete and true, e.g. "published vs. draft" ratio, or "subjects with at least one note" ratio, or just drop it.
- `recentActivity.map((note: any) => ...)` — untyped `any`, easy to fix by typing against `NoteRow`.

### 3.3 `NoteEditorPage.tsx`
Autosave draft editor: local-state-only fetch (`staleTime: Infinity`) so background refetches can't stomp on unsaved edits, a 30s autosave interval using refs (so the interval doesn't reset on every keystroke — this part is genuinely well-built), and a separate "Publish" action that copies draft → live columns.

- **Bug — Publish toggle only works one direction.** The `Switch` for "Published" only writes to the DB when turned **off** (`if (!v) { ...update published:false }`). Turning it **on** only calls `setPublished(true)` locally — nothing is persisted. A user could toggle it on, believe the note is live, navigate away, and it silently reverts (since `note.published` in the DB never changed). The actual way to publish is the separate "Publish Changes" button. Having a control that looks binary but is actually one-directional is a real footgun. **Fix:** either make the switch fully bidirectional (call `publishMutation` when turned on), or replace it with a read-only status pill and keep only the explicit "Publish" button as the single source of truth for going live.
- **No cover image / difficulty fields in the editor UI at all**, despite both columns existing on `notes` since migration `20260705000000` (§1) and both being read by `Library.tsx`'s difficulty badge and (once §2.1 is fixed) `NotePage.tsx`'s hero. Right now there is **no way for an admin to ever set a note's difficulty or cover image** through the UI — the columns can only be populated via direct SQL. This is probably the single highest-value small addition to this file: two more fields (`Select` for difficulty, `Input` + maybe a `media_assets` picker for cover image) next to the title field.
- **No unsaved-changes warning on tab close** (`beforeunload`) — only `saveDraft()` on the in-app back button. A user who closes the browser tab within the 30s autosave window loses that window's edits. Cheap to add.
- **No conflict/concurrency handling** — if two admins open the same note, the last save wins silently, no warning. Low priority unless there's more than one content editor.

### 3.4 `TutorialEditorPage.tsx`
Same shape and same "Published" toggle bug as `NoteEditorPage` (§3.3) — verified identical logic (`onCheckedChange` only writes on `!v`). Fix both together; ideally by extracting a shared `usePublishToggle` hook or a shared `<PublishedSwitch>` component so this class of bug can't recur independently in each editor.

### 3.5 `NoteRelationsPanel.tsx`
Lets an admin link a note ↔ tutorial, and set `previous_note_id`/`next_note_id`.

- **The tutorial link is real and used** — `TutorialPage.tsx` reads `tutorial.notes.slug` to render a "related note" link (§4.2). Good, keep as-is.
- **The prev/next-note links are dead** (§0.5, §1). This panel's UI implies to an admin "I am controlling the reading order," but `NotePage.tsx` actually computes prev/next from `sort_order` within the subject (§4.1). **Pick one system:** either delete this half of the panel and rely purely on `sort_order` (simpler, already works), or replace `NotePage`'s prev/next calculation with a lookup of `previous_note_id`/`next_note_id` (more flexible — allows branching/non-linear series, e.g. skipping a note in normal order for a "see also" link) and drop `sort_order`-based navigation. Shipping both, silently disconnected, is strictly worse than either alone.
- **Dropdown lists every note across every subject**, not scoped to the current note's subject — an admin can accidentally set a Calculus note's "next" to an Algebra note. Should filter `allNotes` by `subject_id === note.subject_id`.

### 3.6 `NotesManager.tsx` / `TutorialsManager.tsx`
List views with create/delete. Functionally fine but minimal:

- **No search/filter/sort/pagination** on either table — acceptable at ~10 rows, will not scale.
- **`window.confirm()`** for delete confirmation instead of the app's own `AlertDialog` component (which is already in `src/components/ui/alert-dialog.tsx` and used nowhere in the admin side) — inconsistent with the rest of the design system, and gives no information about consequences (e.g., "this note is linked from 2 tutorials").
- **Hard delete with no dependency check.** Deleting a note that a tutorial points to via `note_id` will just null that FK out silently (`on delete set null`) — the tutorial keeps working but loses its "related note" link with zero warning to the admin doing the deleting.
- **Inconsistency between the two tables:** `TutorialsManager` shows a Difficulty column and badge styling (`getDifficultyStyle`); `NotesManager` does not, even though notes have had a `difficulty` column since migration `20260705000000` (§1) and the note-detail hero displays it. Bring `NotesManager`'s table in line with `TutorialsManager`'s (add the Difficulty column) — and note `TutorialsManager` is missing the "Updated" date column that `NotesManager` has, so it's not a strict superset either; worth reconciling both into one shared `<ContentTable>` component parameterized by entity type, so future columns only need to be added once.

### 3.7 `CreateNoteDialog.tsx` / `CreateTutorialDialog.tsx`
Near-identical modals (title → auto-slug → subject picker → insert → redirect to editor).

- **No duplicate-slug handling.** `notes`/`tutorials` both have a `unique(subject_id, slug)` constraint (§1); if an admin creates two notes with the same auto-generated slug in the same subject, the raw Postgres unique-violation error surfaces with no `onError` handler catching it — the button just silently fails to redirect (the mutation errors, `onSuccess` never fires) with no message shown to the user at all. **Fix:** add `onError` with a toast ("That slug already exists in this subject — try a different title or edit the slug manually"), and ideally check-and-suffix the slug proactively.
- These two files are ~90 lines each and 95% identical (only the table name and a couple of strings differ). Worth collapsing into one `<CreateContentDialog kind="note" | "tutorial">`.

### 3.8 `ContentEditor.tsx`
Thin wrapper around `MathRichTextEditor`. Fine as-is — a clean seam if the editor implementation ever needs swapping.

### 3.9 `MathRichTextEditor.tsx`
The actual authoring toolbar: headings, bold, lists, quote, link, image, video, table generator, inline/display math. Generally well-built (the table generator dialog with live cell editing is a nice touch; the mobile write/preview tab split is sensible).

- **"Insert Image" is a bare URL text field** — the author has to already have the image hosted somewhere and paste a link. There is no upload, no browse-existing-media picker, even though `media_assets` (§1) exists specifically for this. This is the direct authoring-side symptom of `MediaManager` being a stub (§3.10) — fixing one without the other doesn't help; they need to ship together: `MediaManager` becomes "upload to Supabase Storage → insert row in `media_assets`," and this dialog's image button gets a second tab, "Browse Library," that lists `media_assets` and inserts the chosen URL.
- **No paste-image-from-clipboard / drag-and-drop.** Common expectation for a "rich" editor now; worth adding once uploads exist at all.
- **No image alt-text validation** (empty alt is allowed) — minor accessibility gap on published notes.
- The **video embed only supports YouTube-shaped URLs** cleanly (`MarkdownRenderer.embedVideoMarkers` regex-matches `youtu.be`/`youtube.com`); any other URL is passed through as a raw iframe `src`, which will render a broken embed for e.g. a Vimeo link with no warning to the author at insert time.

### 3.10 `CoursesManager.tsx`, `MediaManager.tsx`, `QuizzesManager.tsx`, `SubjectsManager.tsx`
```tsx
import React from "react"; export default () => <div className="p-6">Courses Manager Coming Soon</div>;
```
All four files, verbatim, are one line each. This is the single largest concrete gap in the content pipeline: **an admin cannot, through the UI, create a subject, a course, a quiz, or a media asset.** Given `contentService`/`courseService`/`quizService` are otherwise fully built for reading this data, and the DB schema and RLS are complete for all four (§1), the remaining work here is UI-only:

- **`SubjectsManager`** — highest priority of the four, since subjects are a hard dependency of note/tutorial creation (`CreateNoteDialog`'s subject `<Select>` is empty until subjects exist). Needs: list + create + rename + reorder (`sort_order`) + delete-with-guard (block delete if notes/tutorials reference it, since the FK is `on delete cascade` — deleting a subject today would silently cascade-delete every note and tutorial in it with zero confirmation of that blast radius).
- **`QuizzesManager`** — list quizzes, create one tied to a tutorial, add/reorder/delete `quiz_questions` (mirrors the table-generator UX already built in `MathRichTextEditor`, so there's a reusable pattern to follow).
- **`CoursesManager`** — list/create/edit courses, and manage `course_modules` (ordered list of note/tutorial references) — essentially a drag-reorderable list picking from existing notes/tutorials, since `course_modules` just points at them by FK.
- **`MediaManager`** — list `media_assets`, upload to Supabase Storage (needs a storage bucket + policy, not present in any migration currently — this is new infrastructure, not just UI), delete, and (per §3.9) expose a picker consumable from the rich text editor.

### 3.11 `adminSidebarData.ts`
- Links to `/admin/settings`, but no `Settings.tsx` page or route exists anywhere in `App.tsx` — clicking it 404s. Either build a minimal settings page (site name, contact email, etc.) or remove the nav item until one exists.
- Otherwise fine — every other listed item (`Dashboard`, `Subjects`, `Notes`, `Tutorials`, `Quizzes`, `Courses`, `Media`) does correspond to a real route, even where that route currently renders a stub (§3.10).

---

## 4. Student side — `src/pages/` and related components

### 4.1 `NotePage.tsx`
Note detail page. (This is the file we iterated on earlier in this conversation for hero layout — those changes are separate from the content-management review below.)

- Computes prev/next navigation from `subjectNotes` array position, not from `previous_note_id`/`next_note_id` — see §3.5 for the full discussion of this disconnect.
- Depends on `note.difficulty`, `note.updated_at`, and (after our earlier change) `note.hero_image`/`cover_image` — all of which are silently `undefined` today because `contentService.getNoteBySlug` doesn't select them (§2.1). Fixing the service fixes this page for free.
- Uses `MarkdownRenderer` (§4.7) — gets callout boxes and video embeds, but not the `:::question/:::solution` interactive blocks that only `TutorialRenderer` supports (§4.9). If a note author wants a practice question with a collapsible solution — a very natural thing to want in a *notes* page — they currently can't.

### 4.2 `TutorialPage.tsx`
Tutorial detail page. Correctly renders the "related note" link via `tutorial.notes.slug` (§3.5). Uses `TutorialRenderer` (§4.9), not `MarkdownRenderer` — so a tutorial can't use the Definition/Theorem/Example callouts that notes can. See §4.7/§4.9 for the consolidation recommendation.

### 4.3 `Library.tsx`
Correctly DB-driven (`getAllNotes`, `getAllSubjects`), includes a Supabase Realtime subscription on the `notes` table so the list updates live when an admin publishes — this is a genuinely nice touch and a pattern worth reusing elsewhere (e.g., `NotesManager` doesn't have this, so two admins working simultaneously won't see each other's changes without a manual refresh). No significant issues found here.

### 4.4 `StudentDashboard.tsx`
- **"Recent Activity" is a permanently hardcoded empty state** — there is no query at all, just static JSX telling every student "You haven't started any courses or tutorials yet," forever, regardless of actual usage. The `course_progress` table (§1) exists precisely to back this and is never referenced anywhere in `src/` (confirmed via full-repo search). This is a fully-speced, half-built feature: the schema is done, the UI shell is done, only the middle (writing progress rows when a student completes a note/tutorial/quiz, and reading them back here) is missing.
- **Sidebar links to seven routes that don't exist**: `studentSidebarData.ts` lists `/dashboard/courses`, `/dashboard/plans`, `/dashboard/transactions`, `/dashboard/billing/cards`, `/dashboard/billing/invoices`, `/dashboard/help`, `/dashboard/settings` — none are registered in `App.tsx` (only bare `/dashboard` is). Every one of these sidebar items 404s today. Same root cause as the admin `/admin/settings` link (§3.11) — sidebar data files were written ahead of the routes that back them. Either scope the sidebar down to what exists (`Dashboard`, `Library`) until the rest is built, or build the routes.

### 4.5 `Courses.tsx`
DB-driven via `courseService.getPublishedCourses` — correctly migrated off the old hardcoded version the migration comment references. No issues found.

### 4.6 `Quiz.tsx` / `QuizPage.tsx`
Clean split: `QuizPage` fetches via `quizService.getQuizByTutorialSlug` and correctly maps the DB's `correct_index` (snake_case) to the component's `correct` prop; `Quiz.tsx` is presentational/stateful quiz-taking UI. No field-mismatch bugs found (I checked this specifically, since it's an easy place for that class of bug to hide).

- The only gap here is upstream: since `QuizzesManager` is a stub (§3.10), this well-built player has no admin-facing way to get new quizzes into it.
- Quiz results aren't persisted anywhere (ties back to §4.4 — a completed quiz would be a natural `course_progress` write, or a new `quiz_attempts` table, neither of which exists).

### 4.7 `MarkdownRenderer.tsx`
Used by `NotePage` and inside `MathRichTextEditor`'s live preview. Strong implementation: KaTeX math, syntax-highlighted code blocks, auto-slugged headings with anchor links (shared `slugify` export that `NotePage` uses to build its table of contents — good, this coupling is intentional and correct), styled Definition/Theorem/Example callout boxes sniffed from blockquote syntax, and a custom video-embed comment syntax (`<!-- video: url -->`).
- See §4.9 for the duplication issue with `TutorialRenderer`.
- `rehypeRaw` is enabled (needed for the video-embed HTML injection), which means **any raw HTML written into `content_md` gets rendered as-is** — since only admins can write notes today this is low risk, but if content authorship is ever opened to more users, this is an XSS vector worth sanitizing (e.g. `rehype-sanitize` with an allowlist that still permits the specific `<div class="aspect-video">…<iframe>` shape the video embed needs).

### 4.8 `MathRichTextEditor.tsx`
Covered in §3.9 (it's an admin-authoring component, but the file lives at `src/components/` top level, not under `admin/` — worth moving into `components/admin/` for discoverability, since `ContentEditor.tsx` right next to it in `components/admin/` is just a wrapper around it).

### 4.9 `TutorialRenderer.tsx`
- A **second, independent markdown pipeline** (own `ReactMarkdown` + `remarkMath`/`remarkGfm`/`rehypeKatex` + `Prism`/`oneDark` setup) that duplicates almost all of `MarkdownRenderer.tsx`'s job, styled differently, and supporting a different feature (custom `:::question\n...\n:::\n:::solution\n...\n:::` regex-parsed toggle blocks that `MarkdownRenderer` has no equivalent for).
- Contains a leftover `useEffect` that calls `window.MathJax.typesetPromise?.()` — dead code, since this app renders math with KaTeX (via `rehypeKatex`), not MathJax; `window.MathJax` will never exist, so this effect is a permanent no-op left over from an earlier implementation.
- Untyped: `content`, `visibleSolutions` question/answer parsing all work on implicit `any`, unlike `MarkdownRenderer`'s typed props — easy to introduce a runtime error here that TypeScript won't catch.
- **Recommendation:** consolidate into one renderer. Concretely: port the `:::question/:::solution` parser into `MarkdownRenderer.tsx` as a remark plugin or a pre-processing step (same pattern already used there for `embedVideoMarkers`), delete `TutorialRenderer.tsx`, and have `TutorialPage.tsx` render tutorials through `MarkdownRenderer` like `NotePage` does for notes. This immediately gives tutorials the callout boxes and gives notes the question/solution blocks, from both directions, for free — and removes ~350 lines of drifted duplicate code.

### 4.10 `Navbar.tsx`
Already covered in depth at §2.4 — the search wiring is the main issue (`searchContent` instead of `searchContentDB`). Everything else about this file (mobile menu, theme selector, auth-aware actions, Ctrl+K focus shortcut on the *desktop search input* — note this is a plain input, separate from the `CommandMenu`/`Cmd+K` palette described next) is fine.

### 4.11 `command-menu.tsx` + `search-provider.tsx`
A shadcn-style `Cmd+K` command palette, mounted inside the authenticated dashboard shell (`DashboardLayout` → used by both `AdminLayout` and `StudentDashboard`). Currently only lists 5 static navigation links (`Home`, `Library`, `Tutorials`, `Courses`, `Dashboard`) — it does not search notes/tutorials at all, and doesn't import `searchService` in any form.
- **Missed opportunity, admin side especially:** this would be a natural, low-effort place to add "jump to note/tutorial editor" — e.g. wire it to `searchContentDB` (once fixed, §2.4) filtered to admin-editable routes, so an admin can hit Cmd+K and type a note title to jump straight into editing it, instead of navigating `Notes → find in table → Edit`.

---

## 5. Cross-cutting

### 5.1 Security posture (RLS + routing) — summary of scattered findings above
Collected in one place since they compound:
- Editor routes (`/admin/notes/:id/edit`, `/admin/tutorials/:id/edit`) bypass the `AdminLayout` guard entirely (§3.1).
- The public RLS read policy is row-level (`published = true`) but not column-level, so a published row's `draft_content_md`/`draft_title` (i.e., an admin's in-progress unpublished edits to an already-live note) are selectable by anyone who queries those columns directly via the Supabase client, published-route-guard or not (§1, §3.3).
- `grant all` to `anon`/`authenticated` on every table (§1) means RLS is a single point of failure for every table, present and future.
None of these are exploitable by a casual browsing student today (nothing currently surfaces draft content in the student UI), but they're one careless future feature away from a real leak, and worth closing now while the fix is small.

### 5.2 `AuthContext.tsx`
Solid — handles session init, refresh-token errors, periodic refresh, role fetch from `profiles`. No content-management-specific issues. One gap worth noting: **there is no UI anywhere in the app to promote a user to `role = 'admin'`** — `profiles.role` defaults to `'student'` and the only way to create an admin today is a manual `UPDATE profiles SET role='admin'` in Supabase Studio. Fine for a single-operator site; will need a "Users" admin section (not currently in the sidebar at all) the moment there's more than one content editor.

### 5.3 `scripts/migrate-content.ts`
One-off migration script (reads old `public/content/**/*.md`, upserts into Supabase). Well-commented, uses the service-role key correctly (bypasses RLS, explicitly marked never-in-browser). Since `public/content/` no longer exists in the repo (§2.4), this script is now historical — either delete it once you've confirmed the migration is fully complete and won't need re-running, or keep it in a `/scripts/archive` with a comment explaining it's a one-time historical artifact, so a future contributor doesn't run it expecting it to do anything.

### 5.4 Testing (`*.test.ts(x)`)
Five test files exist (`cookies.test.ts`, `utils.test.ts`, `handle-server-error.test.ts`, `use-table-url-state.test.ts`, `search-provider.test.tsx`), but **`package.json` has no `test` script and no `vitest`/`jest`/`@testing-library` dependency at all.** These files cannot currently be executed in this repo as configured — they're dead until a test runner is added (`npm install -D vitest @testing-library/react jsdom`, plus a `"test": "vitest"` script and a `vite.config.ts` test block). Not a content-management issue directly, but worth flagging since it means none of the logic described in this document (autosave, publish toggles, search ranking) has any regression safety net.

### 5.5 `public/assets/pdfs/` (≈20 files) and `public/assets/images/`
A large amount of static content — full textbooks, past exam papers, subject cover images — sits directly in `public/`, served as static files, completely outside the CMS/database model everything else has moved to. Only 3 of these PDFs are indexed anywhere (hardcoded in `searchService.ts`, §2.4). This is really the same root issue as `MediaManager` being a stub (§3.10): once that's built against `media_assets`, these files (or their replacements) should be migrated in as rows (`type: 'document'`), so the library of textbooks/past-papers becomes admin-manageable (add/remove/reorganize) instead of requiring a code deploy to change.

---

## 6. Files reviewed with no significant content-management issues found

For completeness — these were read but don't need changes for the purposes of this review: `App.tsx` (routing is correct except the two gaps noted in §3.1/§3.11/§4.4), `lib/supabaseClient.ts`, `lib/utils.ts`, `lib/cookies.ts`, `lib/handle-server-error.ts`, `contexts/ThemeContext.tsx` / `theme-provider.tsx` / `direction-provider.tsx` / `font-provider.tsx` / `layout-provider.tsx`, `hooks/*`, `components/layout/DashboardLayout.tsx`, `authenticated-layout.tsx`, `header.tsx`, `main.tsx`, `nav-group.tsx`, `nav-user.tsx`, `team-switcher.tsx`, `top-nav.tsx`, `app-sidebar.tsx`, `app-title.tsx`, `components/layout/Footer.tsx`, `components/ui/*` (the ~55 shadcn/ui primitives — `button.tsx`, `dialog.tsx`, `select.tsx`, `table.tsx`, etc. — these are generic, unmodified-from-shadcn building blocks, not content-management logic), `Auth.tsx`, `Index.tsx`, `Contact.tsx`, `JMCPlus.tsx`, `PrivacyPolicy.tsx`, `TermsOfService.tsx`, `NotFound.tsx`, config files (`vite.config.ts`, `tailwind.config.ts`, `tsconfig*.json`, `eslint.config.js`, `postcss.config.js`, `components.json`, `netlify.toml`, `.gitignore`).

---

## 7. Prioritized roadmap

**P0 — fix now, small and high-impact:**
1. `contentService.ts`: add `difficulty, cover_image, updated_at` to all note/tutorial select strings (§2.1).
2. Fix the Publish toggle in both editors to be bidirectional, or remove it in favor of the explicit Publish button (§3.3/§3.4).
3. Fix the two broken links on `AdminDashboard` (§3.2) and the seven broken links in `studentSidebarData` (§4.4) — either point them at real routes or hide the nav items.
4. Guard the two editor routes with the same auth check as `AdminLayout` (§3.1, §5.1).
5. Rewire `Navbar.tsx` search to `searchContentDB`, fixing the RPCs to return subject slug so the resulting URLs actually work (§2.4).

**P1 — build the missing admin surfaces (§3.10):**
6. `SubjectsManager` (blocks note/tutorial creation quality — right now subjects can only be added via SQL).
7. `QuizzesManager`.
8. `MediaManager` + Supabase Storage bucket + hook it into `MathRichTextEditor`'s image insert (§3.9).
9. `CoursesManager`.

**P2 — consolidation and correctness:**
10. Merge `MarkdownRenderer`/`TutorialRenderer` into one component (§4.7/§4.9).
11. Resolve the prev/next-note dead-columns situation one way or the other (§3.5).
12. Add `course_progress` writes + a real "Recent Activity" query on `StudentDashboard` (§4.4).
13. Tighten the blanket `GRANT ALL` migration (§1/§5.1).
14. Add a test runner and wire up the five orphaned test files (§5.4).

**P3 — polish:**
15. Collapse `CreateNoteDialog`/`CreateTutorialDialog` into one component; same for `NotesManager`/`TutorialsManager` tables (§3.6/§3.7).
16. Replace `window.confirm` deletes with the app's own `AlertDialog` (§3.6).
17. Migrate `public/assets/pdfs`/`images` into `media_assets` once `MediaManager` exists (§5.5).
18. Wire the Cmd+K palette to real content search (§4.11).
