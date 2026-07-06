import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface FabMode {
  key: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface MobileToolFabProps {
  /** Exactly two modes — e.g. "Contents" and "Tools". */
  modes: [FabMode, FabMode];
}

/**
 * Small-screen-only floating control. Renders as a segmented pill with two
 * buttons; tapping one opens a bottom sheet with that mode's content, tapping
 * the active one again (or the backdrop / close button) closes it, and
 * tapping the other mode swaps the sheet's content directly.
 *
 * Hidden entirely at the `lg` breakpoint, where the real sidebars are shown
 * instead — this is purely the mobile substitute for them.
 */
export default function MobileToolFab({ modes }: MobileToolFabProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const active = modes.find((m) => m.key === openKey) ?? null;

  // Lock page scroll while the sheet is open, and allow Escape to close it.
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <div className="lg:hidden">
      <style>{`
        @keyframes fabBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fabSheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .fab-backdrop { animation: fabBackdropIn 0.2s ease-out; }
        .fab-sheet { animation: fabSheetIn 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
        @media (prefers-reduced-motion: reduce) {
          .fab-backdrop, .fab-sheet { animation: none; }
        }
      `}</style>

      {active && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={active.label}>
          <div
            className="fab-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setOpenKey(null)}
          />
          <div className="fab-sheet relative z-10 flex w-full max-h-[75vh] flex-col rounded-t-2xl bg-card shadow-2xl ring-1 ring-border">
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border" aria-hidden="true" />
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {active.icon}
                {active.label}
              </div>
              <button
                type="button"
                onClick={() => setOpenKey(null)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4">{active.content}</div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-30 flex overflow-hidden rounded-full bg-card shadow-lg ring-1 ring-border">
        {modes.map((mode) => {
          const isActive = mode.key === openKey;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setOpenKey(isActive ? null : mode.key)}
              aria-pressed={isActive}
              className={
                'flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors ' +
                (isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary/60')
              }
            >
              {mode.icon}
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
