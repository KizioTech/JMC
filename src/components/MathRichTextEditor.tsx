import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Heading2, Heading3, Bold, List, ListOrdered, Quote, Table2, 
  Sigma, ChevronDown, ChevronUp, Eye, PenLine
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  // UI Tabs
  const [tab, setTab] = useState<"write" | "preview">("write");

  // Toolbar state
  const [mathOpen, setMathOpen] = useState(false);

  // Table Generator dialog state
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);
  const [tableData, setTableData] = useState<string[][]>(() => 
    Array(3).fill("").map(() => Array(2).fill(""))
  );

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

  const mainButtons: ToolbarBtn[] = [
    { icon: Heading2, label: "Heading 2", tooltip: "Large section heading", action: () => insertSyntax("## ") },
    { icon: Heading3, label: "Heading 3", tooltip: "Medium sub-heading", action: () => insertSyntax("### ") },
    { icon: Bold, label: "Bold", tooltip: "Bold text", action: () => insertSyntax("**{}**", true) },
    { icon: List, label: "Bullet", tooltip: "Bullet list", action: () => insertSyntax("- ") },
    { icon: ListOrdered, label: "Number", tooltip: "Numbered list", action: () => insertSyntax("1. ") },
    { icon: Quote, label: "Quote", tooltip: "Blockquote / callout", action: () => insertSyntax("> ") },
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

  return (
    <div className={`flex flex-col w-full ${className}`}>
      
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
      <div className={(!isMobile && withPreview) ? "grid grid-cols-2 gap-0 border border-border/60 rounded-xl overflow-hidden shadow-sm" : ""}>
        
        {/* Editor Side */}
        {(!withPreview || !isMobile || tab === "write") && (
          <div className={(!isMobile && withPreview) ? "bg-muted/30 border-r border-border/60 flex flex-col" : "rounded-xl border border-border/60 bg-muted/30 overflow-hidden focus-within:border-primary transition-colors flex flex-col"}>
            
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
              className={`${minHeight} border-none focus-visible:ring-0 text-md p-6 bg-transparent rounded-none resize-none font-mono leading-relaxed flex-1`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}

        {/* Previews */}
        {withPreview && (
          <>
            {/* Mobile Preview Pane */}
            {(isMobile && tab === "preview") && (
              <div className={`${minHeight} rounded-xl border bg-card p-6 overflow-auto`}>
                <MarkdownRenderer content={value} />
              </div>
            )}

            {/* Desktop Dual Pane */}
            {(!isMobile && withPreview) && (
              <div className={`${minHeight} bg-card p-6 overflow-auto`}>
                <div className="text-[10px] font-bold text-muted-foreground/60 mb-3 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                  <Eye className="h-3 w-3" /> Live Preview
                </div>
                <MarkdownRenderer content={value} />
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
    </div>
  );
}
