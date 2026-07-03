import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CatalogTag, { subjectCode } from "@/components/CatalogTag";
import SubjectArt from "@/components/library/SubjectArt";
import type { NoteRow } from "@/services/contentService";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/15",
  Intermediate: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/15",
  Advanced: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/15",
};

interface NoteCardProps {
  doc: NoteRow;
  position: number;
  className?: string;
}

export default function NoteCard({ doc, position, className }: NoteCardProps) {
  const subjectName = doc.subjects?.name || "General";
  const code = subjectCode(doc.subjects?.slug || subjectName || "gen");
  const date = doc.updated_at
    ? new Date(doc.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  const difficultyStyle =
    DIFFICULTY_STYLE[doc.difficulty || ""] || "bg-[#0A0A0F]/5 text-[#0A0A0F]/45 border-[#0A0A0F]/10";

  return (
    <Link to={`/notes/${doc.subjects?.slug}/${doc.slug}`} className={cn("block h-full", className)}>
      <motion.div
        initial={false}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A0A0F]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_32px_-12px_rgba(10,10,15,0.16)]"
      >
        {/* Cover header — real image when available, on-brand generated art otherwise */}
        <div className="relative h-32 w-full shrink-0 overflow-hidden bg-[#F5F6FA]">
          {doc.cover_image ? (
            <img
              src={doc.cover_image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
              <SubjectArt subject={subjectName} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
          <div className="absolute left-3.5 top-3.5">
            <CatalogTag code={code} index={position} tone="white" />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="rounded-full border-[#0A0A0F]/10 bg-[#0A0A0F]/[0.03] px-2 py-0 font-code text-[10px] font-medium tracking-wide text-[#0A0A0F]/55"
              >
                {subjectName}
              </Badge>
              {doc.difficulty && (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-2 py-0 font-code text-[10px] font-medium tracking-wide",
                    difficultyStyle,
                  )}
                >
                  {doc.difficulty}
                </Badge>
              )}
            </div>

            <h3 className="font-inter text-[17px] font-bold leading-snug text-[#0A0A0F] line-clamp-2 transition-colors group-hover:text-[#4338FF]">
              {doc.title}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#0A0A0F]/8 pt-3">
            <span className="font-code text-[10px] uppercase tracking-wider text-[#0A0A0F]/40">
              {date ? `Updated ${date}` : "Study note"}
            </span>
            <span className="flex items-center gap-1 font-code text-[10px] font-bold uppercase tracking-wider text-[#4338FF] opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              Read
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
