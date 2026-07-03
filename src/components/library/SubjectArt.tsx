/**
 * Lightweight, on-brand SVG "cover art" per subject.
 * Used as the NoteCard header when a note has no cover_image set.
 * No external requests — renders instantly, never breaks, always on-brand.
 */

const INK = "#4338FF";

function pickPattern(subject: string): "algebra" | "calculus" | "discrete" | "trig" | "grid" {
  const s = subject.toLowerCase();
  if (s.includes("alg")) return "algebra";
  if (s.includes("calc")) return "calculus";
  if (s.includes("discrete") || s.includes("graph") || s.includes("set")) return "discrete";
  if (s.includes("trig") || s.includes("geo")) return "trig";
  return "grid";
}

export default function SubjectArt({ subject }: { subject?: string }) {
  const pattern = pickPattern(subject || "");

  return (
    <svg viewBox="0 0 400 140" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="140" fill="url(#note-art-bg)" />
      <defs>
        <linearGradient id="note-art-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={INK} stopOpacity="0.06" />
          <stop offset="100%" stopColor={INK} stopOpacity="0.015" />
        </linearGradient>
      </defs>

      {pattern === "algebra" && (
        <g stroke={INK} strokeOpacity="0.35" fill="none" strokeWidth="2">
          <path d="M20 115 H380" strokeOpacity="0.15" />
          <path d="M60 20 V125" strokeOpacity="0.15" />
          <path d="M40 120 C 140 -10, 220 -10, 340 110" strokeWidth="2.5" />
          <circle cx="60" cy="105" r="3.5" fill={INK} fillOpacity="0.5" stroke="none" />
          <circle cx="235" cy="12" r="3.5" fill={INK} fillOpacity="0.5" stroke="none" />
        </g>
      )}

      {pattern === "calculus" && (
        <g stroke={INK} fill="none">
          <path
            d="M20 110 C 90 20, 160 20, 230 70 C 280 105, 330 40, 380 20"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />
          <path
            d="M90 110 C 150 45, 190 45, 230 70 L 230 110 Z"
            fill={INK}
            fillOpacity="0.08"
            stroke="none"
          />
          <path d="M90 110 V 45" strokeOpacity="0.15" strokeDasharray="3 3" />
          <path d="M230 110 V 70" strokeOpacity="0.15" strokeDasharray="3 3" />
        </g>
      )}

      {pattern === "discrete" && (
        <g stroke={INK} strokeOpacity="0.35" fill={INK}>
          <line x1="70" y1="35" x2="180" y2="30" strokeWidth="1.5" />
          <line x1="70" y1="35" x2="90" y2="105" strokeWidth="1.5" />
          <line x1="180" y1="30" x2="270" y2="90" strokeWidth="1.5" />
          <line x1="90" y1="105" x2="270" y2="90" strokeWidth="1.5" />
          <line x1="270" y1="90" x2="340" y2="40" strokeWidth="1.5" />
          <line x1="180" y1="30" x2="340" y2="40" strokeWidth="1.5" />
          <circle cx="70" cy="35" r="5" fillOpacity="0.6" stroke="none" />
          <circle cx="180" cy="30" r="5" fillOpacity="0.6" stroke="none" />
          <circle cx="90" cy="105" r="5" fillOpacity="0.6" stroke="none" />
          <circle cx="270" cy="90" r="5" fillOpacity="0.6" stroke="none" />
          <circle cx="340" cy="40" r="5" fillOpacity="0.6" stroke="none" />
        </g>
      )}

      {pattern === "trig" && (
        <g stroke={INK} strokeOpacity="0.35" fill="none" strokeWidth="2">
          <path d="M20 70 H380" strokeOpacity="0.15" />
          <path d="M30 70 C 70 10, 110 130, 150 70 S 230 10, 270 70 S 350 130, 380 70" strokeWidth="2.5" />
          <circle cx="330" cy="70" r="26" strokeOpacity="0.2" />
          <line x1="330" y1="70" x2="349" y2="52" strokeOpacity="0.3" />
        </g>
      )}

      {pattern === "grid" && (
        <g stroke={INK} strokeOpacity="0.18">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`v${i}`} x1={40 + i * 65} y1="15" x2={40 + i * 65} y2="125" strokeWidth="1" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={`h${i}`} x1="20" y1={25 + i * 30} x2="380" y2={25 + i * 30} strokeWidth="1" />
          ))}
        </g>
      )}
    </svg>
  );
}
