import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Heading2, Heading3, Bold, List, ListOrdered, Quote, Table2, 
  Sigma, ChevronDown, ChevronUp, Eye, PenLine, Link as LinkIcon, Image as ImageIcon, Video, Upload, Loader2
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabaseClient";

interface MathRichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  /** If true, the component displays its own Write/Preview toggle tab and rendering pane. */
  withPreview?: boolean;
  className?: string;
}

interface ToolbarBtn {
  icon: React.ElementType;
  label: string;
  tooltip: string;
  action: () => void;
  className?: string;
}

export default function MathRichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "min-h-[250px]",
  withPreview = false,
  className = "",
}: MathRichTextEditorProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // Guards against the editor/preview sync handlers re-triggering each other
  const isSyncingScroll = useRef(false);
  
  // UI Tabs
  const [tab, setTab] = useState<"write" | "preview">("write");

  // ————————————————————————————————————————————————————————
  // Cursor-following editor ↔ preview sync (TeXstudio / VS Code style).
  // MarkdownRenderer stamps every block element with data-line={sourceLine},
  // so instead of matching raw scroll percentage (which drifts badly once
  // the two panes render at different densities — one line of LaTeX can
  // become a tall block), we match by *line number*, the same anchor a
  // real synctex-style split editor uses.
  // ————————————————————————————————————————————————————————

  const getLineHeightPx = (el: HTMLTextAreaElement) => {
    const lh = parseFloat(window.getComputedStyle(el).lineHeight);
    return Number.isFinite(lh) && lh > 0 ? lh : 24;
  };

  const getCursorLine = () => {
    const el = textareaRef.current;
    if (!el) return 1;
    return el.value.slice(0, el.selectionStart).split('\n').length; // 1-indexed
  };

  // Scroll the preview so the block matching `line` sits at the top of view.
  const scrollPreviewToLine = (line: number) => {
    const preview = previewRef.current;
    if (!preview) return;
    const marked = Array.from(preview.querySelectorAll<HTMLElement>('[data-line]'));
    if (marked.length === 0) return;

    // Last marked block whose source line is at or before the cursor's line —
    // i.e. "what block is the cursor currently inside/after".
    let target: HTMLElement | null = null;
    for (const el of marked) {
      const elLine = Number(el.dataset.line);
      if (!Number.isFinite(elLine) || elLine > line) break;
      target = el;
    }
    if (!target) target = marked[0];

    const previewRect = preview.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - previewRect.top + preview.scrollTop;

    isSyncingScroll.current = true;
    preview.scrollTo({ top: Math.max(offset - 12, 0), behavior: 'smooth' });
    window.setTimeout(() => { isSyncingScroll.current = false; }, 300);
  };

  // Scroll the editor so `line` sits at the top of view (used when the
  // preview is scrolled directly, e.g. with the mouse wheel over it).
  const scrollEditorToLine = (line: number) => {
    const editor = textareaRef.current;
    if (!editor) return;
    isSyncingScroll.current = true;
    editor.scrollTo({ top: Math.max((line - 1) * getLineHeightPx(editor) - 12, 0), behavior: 'smooth' });
    window.setTimeout(() => { isSyncingScroll.current = false; }, 300);
  };

  // Fires on click / arrow keys / typing — i.e. whenever the cursor actually moves.
  const handleCursorActivity = () => {
    if (isSyncingScroll.current) return;
    scrollPreviewToLine(getCursorLine());
  };

  // Fires on raw wheel/track-pad scroll of the editor (cursor unchanged) — follow
  // whatever line is now at the top of the visible editor viewport instead.
  const handleEditorScroll = () => {
    const editor = textareaRef.current;
    if (!editor || isSyncingScroll.current) return;
    const topLine = Math.floor(editor.scrollTop / getLineHeightPx(editor)) + 1;
    scrollPreviewToLine(topLine);
  };

  // Fires when the preview itself is scrolled directly — walk back to the
  // nearest marked block and pull the editor to that line.
  const handlePreviewScroll = () => {
    const preview = previewRef.current;
    if (!preview || isSyncingScroll.current) return;
    const marked = Array.from(preview.querySelectorAll<HTMLElement>('[data-line]'));
    if (marked.length === 0) return;
    const previewRect = preview.getBoundingClientRect();

    // First block whose top is at/below the preview's own top — i.e. the
    // block currently at the top edge of the visible preview.
    let topBlock: HTMLElement | null = null;
    for (const el of marked) {
      if (el.getBoundingClientRect().top >= previewRect.top - 4) {
        topBlock = el;
        break;
      }
    }
    if (!topBlock) topBlock = marked[marked.length - 1];

    const line = Number(topBlock.dataset.line);
    if (Number.isFinite(line)) scrollEditorToLine(line);
  };

  // Toolbar state
  const [mathOpen, setMathOpen] = useState(false);

  // Table Generator dialog state
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);
  const [tableData, setTableData] = useState<string[][]>(() => 
    Array(3).fill("").map(() => Array(2).fill(""))
  );

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    setTableData(prev => {
      const newRows = tableRows + 1;
      const newCols = tableCols;
      return Array.from({ length: newRows }).map((_, rIdx) => 
        Array.from({ length: newCols }).map((_, cIdx) => prev[rIdx]?.[cIdx] || "")
      );
    });
  }, [tableRows, tableCols]);

  const updateTableCell = (r: number, c: number, val: string) => {
    setTableData(prev => {
      const next = [...prev];
      next[r] = [...next[r]];
      next[r][c] = val;
      return next;
    });
  };

  const insertSyntax = (syntax: string, wrap = false) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const insertion = wrap && selected ? syntax.replace("{}", selected) : syntax.replace("{}", "");
    
    const newContent = value.substring(0, start) + insertion + value.substring(end);
    onChange(newContent);

    // After state updates, re-focus and place cursor properly
    setTimeout(() => {
      el.focus();
      const pos = start + insertion.length;
      el.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertTable = () => {
    const cols = Math.max(1, tableCols);
    const rows = Math.max(1, tableRows);

    let markdown = "\n";
    // Header
    for (let c = 0; c < cols; c++) markdown += `| ${tableData[0]?.[c]?.trim() || `Header ${c+1}`} `;
    markdown += "|\n";
    // Separator
    for (let c = 0; c < cols; c++) markdown += "|---";
    markdown += "|\n";
    // Data
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) markdown += `| ${tableData[r]?.[c]?.trim() || `Cell ${r},${c+1}`} `;
      markdown += "|\n";
    }

    insertSyntax(markdown + "\n");
    setIsTableDialogOpen(false);
    setTableRows(2);
    setTableCols(2);
    setTableData(Array(3).fill("").map(() => Array(2).fill("")));
  };

  const insertLink = () => { insertSyntax(`[${linkText || 'link'}](${linkUrl})`); setLinkOpen(false); setLinkUrl(''); setLinkText(''); };
  const insertImage = () => { insertSyntax(`![${imageAlt}](${imageUrl})`); setImageOpen(false); setImageUrl(''); setImageAlt(''); };
  const insertVideo = () => { insertSyntax(`\n\n<!-- video: ${videoUrl} -->\n\n`); setVideoOpen(false); setVideoUrl(''); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
      if (!imageAlt) setImageAlt(file.name.replace(`.${fileExt}`, ''));
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const mainButtons: ToolbarBtn[] = [
    { icon: Heading2, label: "Heading 2", tooltip: "Large section heading", action: () => insertSyntax("## ") },
    { icon: Heading3, label: "Heading 3", tooltip: "Medium sub-heading", action: () => insertSyntax("### ") },
    { icon: Bold, label: "Bold", tooltip: "Bold text", action: () => insertSyntax("**{}**", true) },
    { icon: List, label: "Bullet", tooltip: "Bullet list", action: () => insertSyntax("- ") },
    { icon: ListOrdered, label: "Number", tooltip: "Numbered list", action: () => insertSyntax("1. ") },
    { icon: Quote, label: "Quote", tooltip: "Blockquote / callout", action: () => insertSyntax("> ") },
    { icon: LinkIcon, label: "Link", tooltip: "Insert link", action: () => setLinkOpen(true) },
    { icon: ImageIcon, label: "Image", tooltip: "Insert image", action: () => setImageOpen(true) },
    { icon: Video, label: "Video", tooltip: "Embed video", action: () => setVideoOpen(true) },
    { icon: Table2, label: "Table", tooltip: "Insert table", action: () => setIsTableDialogOpen(true) },
  ];

  const mathButtons: ToolbarBtn[] = [
    { icon: Sigma, label: "Inline Math", tooltip: "$...$", action: () => insertSyntax("${}$", true) },
    { icon: Sigma, label: "Display Math", tooltip: "$$\\n...\\n$$", action: () => insertSyntax("$$\n{}\n$$", true), className: "opacity-70" },
  ];

  const ToolbarButton = ({ btn }: { btn: ToolbarBtn }) => (
    <button
      type="button"
      onClick={btn.action}
      title={btn.tooltip}
      className={`group flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground ${btn.className || ""}`}
    >
      <btn.icon className="h-4 w-4" />
      <span className="text-[9px] font-medium leading-none hidden sm:block">{btn.label}</span>
    </button>
  );

  // `minHeight` doubles as: (a) a fixed-height class like "h-full" when the parent
  // already gives us a bounded box (this is how NoteEditorPage/TutorialEditorPage
  // use it — the editor should fill and internally scroll, never grow the page),
  // or (b) a floor like "min-h-[500px]" for standalone use with no bounded parent.
  const isFillMode = minHeight.includes('h-full') || minHeight.includes('h-screen');

  return (
    <div className={`flex flex-col w-full ${isFillMode ? 'h-full min-h-0' : minHeight} ${className}`}>
      
      {/* Editor Top Bar for Mobile Preview Toggle */}
      {(withPreview && isMobile) && (
        <div className="flex items-center justify-end mb-2">
          <div className="flex rounded-lg border bg-muted/50 p-0.5">
            <button 
              type="button" onClick={() => setTab("write")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "write" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              <PenLine className="h-3.5 w-3.5" /> Write
            </button>
            <button 
              type="button" onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={
        (!isMobile && withPreview)
          ? `grid grid-cols-2 gap-0 border border-border/60 rounded-xl shadow-sm overflow-hidden ${isFillMode ? 'flex-1 min-h-0' : minHeight}`
          : (isFillMode ? 'flex-1 min-h-0 flex flex-col' : '')
      }>
        
        {/* Editor Side */}
        {(!withPreview || !isMobile || tab === "write") && (
          <div className={(!isMobile && withPreview) ? "bg-muted/30 border-r border-border/60 flex flex-col min-h-0 h-full" : "rounded-xl border border-border/60 bg-muted/30 overflow-hidden focus-within:border-primary transition-colors flex flex-col min-h-0 h-full flex-1"}>
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-border/40 shrink-0">
              {mainButtons.map((btn) => <ToolbarButton key={btn.label} btn={btn} />)}

              <div className="h-8 w-px bg-border/60 mx-1 hidden sm:block" />

              {/* Math & Advanced toggle */}
              <button
                type="button"
                onClick={() => setMathOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mathOpen
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm"
                }`}
              >
                <Sigma className="h-4 w-4" />
                <span className="hidden sm:inline">Math &amp; LaTeX</span>
                {mathOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {/* Collapsible Math row */}
            {mathOpen && (
              <div className="px-3 py-3 bg-primary/[0.03] border-b border-border/40 animate-in slide-in-from-top-1 duration-200 shrink-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Math expressions</p>
                <div className="flex flex-wrap gap-2">
                  {mathButtons.map(btn => (
                    <button
                      key={btn.label} type="button" onClick={btn.action} title={btn.tooltip}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:border-primary/50 hover:shadow-sm transition-all text-sm mb-1"
                    >
                      <btn.icon className={`h-3.5 w-3.5 text-primary ${btn.className || ""}`} />
                      <span className="font-medium">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Textarea 
              ref={textareaRef}
              placeholder={placeholder}
              onScroll={handleEditorScroll}
              onKeyUp={handleCursorActivity}
              onClick={handleCursorActivity}
              className="flex-1 min-h-0 overflow-y-auto border-none focus-visible:ring-0 text-md p-6 bg-transparent rounded-none resize-none font-mono leading-relaxed"
              value={value}
              onChange={(e) => { onChange(e.target.value); handleCursorActivity(); }}
            />
          </div>
        )}

        {/* Previews */}
        {withPreview && (
          <>
            {/* Mobile Preview Pane */}
            {(isMobile && tab === "preview") && (
              <div className={`${isFillMode ? 'flex-1 min-h-0' : minHeight} rounded-xl border bg-card p-6 overflow-y-auto`}>
                <MarkdownRenderer content={value} />
              </div>
            )}

            {/* Desktop Dual Pane */}
            {(!isMobile && withPreview) && (
              <div className="flex flex-col min-h-0 h-full bg-card">
                <div className="text-[10px] font-bold text-muted-foreground/60 px-6 pt-6 pb-3 uppercase tracking-widest flex items-center gap-1.5 border-b shrink-0">
                  <Eye className="h-3 w-3" /> Live Preview
                </div>
                <div ref={previewRef} onScroll={handlePreviewScroll} className="flex-1 min-h-0 overflow-y-auto p-6">
                  <MarkdownRenderer content={value} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Table Generator Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-primary" />
              Insert Table
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table-cols">Columns</Label>
                <Input id="table-cols" type="number" min={1} max={20} value={tableCols} onChange={(e) => setTableCols(parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-rows">Data Rows</Label>
                <Input id="table-rows" type="number" min={1} max={100} value={tableRows} onChange={(e) => setTableRows(parseInt(e.target.value) || 1)} />
              </div>
            </div>
            
            <div className="border rounded-md overflow-x-auto mt-2 max-h-[30vh]">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted text-muted-foreground sticky top-0">
                  <tr>
                    {Array.from({ length: tableCols }).map((_, c) => (
                      <th key={`h-${c}`} className="p-0.5 min-w-[120px] border-b border-r last:border-r-0 font-normal">
                        <Input 
                          value={tableData[0]?.[c] || ""} onChange={(e) => updateTableCell(0, c, e.target.value)}
                          placeholder={`Header ${c+1}`}
                          className="h-8 text-xs font-bold border-transparent focus-visible:ring-1 focus-visible:ring-inset bg-transparent hover:bg-background/20 rounded-sm rounded-b-none"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: tableRows }).map((_, r) => (
                    <tr key={`r-${r}`} className="border-b last:border-b-0 group">
                      {Array.from({ length: tableCols }).map((_, c) => (
                        <td key={`c-${r}-${c}`} className="p-0.5 border-r last:border-r-0">
                          <Input 
                            value={tableData[r+1]?.[c] || ""} onChange={(e) => updateTableCell(r + 1, c, e.target.value)}
                            placeholder={`Cell ${r+1},${c+1}`}
                            className="h-8 text-xs border-transparent focus-visible:ring-1 focus-visible:ring-inset bg-transparent group-hover:bg-muted/30 hover:bg-muted/50 rounded-sm"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsTableDialogOpen(false)}>Cancel</Button>
            <Button onClick={insertTable} className="bg-accent text-accent-foreground hover:bg-accent/90">Insert Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Text to display</Label>
              <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="e.g. Click here" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkOpen(false)}>Cancel</Button>
            <Button disabled={!linkUrl} onClick={insertLink}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Insert Image</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full gap-2"
                >
                  {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploadingImage ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>
            </div>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider">or provide URL</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Alt text</Label>
              <Input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Description of image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageOpen(false)}>Cancel</Button>
            <Button disabled={!imageUrl} onClick={insertImage}>Insert Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Embed Video</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>YouTube / Video URL</Label>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoOpen(false)}>Cancel</Button>
            <Button disabled={!videoUrl} onClick={insertVideo}>Embed Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}