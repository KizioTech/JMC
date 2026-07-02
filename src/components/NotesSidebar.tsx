import { Link } from 'react-router-dom';
import { NoteRow } from '@/services/contentService';

export default function NotesSidebar({
  subjectName,
  notes,
  currentSlug,
  subjectSlug,
}: {
  subjectName: string;
  notes: NoteRow[];
  currentSlug: string;
  subjectSlug: string;
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{subjectName}</div>
      <nav className="space-y-1">
        {notes.map(n => (
          <Link
            key={n.id}
            to={`/notes/${subjectSlug}/${n.slug}`}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              n.slug === currentSlug
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {n.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
