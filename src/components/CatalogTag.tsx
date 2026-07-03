import { cn } from "@/lib/utils";

/**
 * A library-catalog-style index tag, e.g. "CAL·03".
 * Mirrors the course-code convention already used across JMC's own material
 * (MAT221, MAT222, ...) — subject code + position, not decorative numbering.
 */
export function subjectCode(slugOrName: string) {
  return (slugOrName || "GEN").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "GEN";
}

export default function CatalogTag({
  code,
  index,
  className,
  tone = "volt",
}: {
  code: string;
  index: number;
  className?: string;
  tone?: "volt" | "ink" | "white";
}) {
  const toneClass =
    tone === "volt" ? "text-[#4338FF]" : tone === "white" ? "text-white" : "text-[#0A0A0F]";
  return (
    <span className={cn("font-code text-[11px] font-bold tracking-wide", toneClass, className)}>
      {code}·{String(index).padStart(2, "0")}
    </span>
  );
}
