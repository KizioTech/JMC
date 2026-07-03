import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CatalogTag, { subjectCode } from "@/components/CatalogTag";
import SubjectArt from "@/components/library/SubjectArt";
import type { TutorialRow } from "@/services/contentService";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/15",
  Intermediate: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/15",
  Advanced: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/15",
};

interface TutorialCardProps {
  tutorial: TutorialRow;
  position: number;
}

export default function TutorialCard({ tutorial, position }: TutorialCardProps) {
  const subjectName = tutorial.subjects?.name || "General";
  const code = subjectCode(tutorial.subjects?.slug || subjectName);
  const difficultyStyle =
    DIFFICULTY_STYLE[tutorial.difficulty || ""] || "bg-[#0A0A0F]/5 text-[#0A0A0F]/45 border-[#0A0A0F]/10";

  return (
    <Link to={`/tutorials/${tutorial.subjects?.slug}/${tutorial.slug}`} className="block h-full">
      <motion.div
        initial={false}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A0A0F]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_32px_-12px_rgba(10,10,15,0.16)]"
      >
        <div className="relative h-28 w-full shrink-0 overflow-hidden bg-[#F5F6FA]">
          <SubjectArt subject={subjectName} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
          <div className="absolute left-3.5 top-3.5">
            <CatalogTag code={code} index={position} tone="white" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="rounded-full border-[#0A0A0F]/10 bg-[#0A0A0F]/[0.03] px-2 py-0 font-code text-[10px] font-medium tracking-wide text-[#0A0A0F]/55"
              >
                {subjectName}
              </Badge>
              {tutorial.difficulty && (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-2 py-0 font-code text-[10px] font-medium tracking-wide",
                    difficultyStyle,
                  )}
                >
                  {tutorial.difficulty}
                </Badge>
              )}
            </div>

            <h3 className="font-inter text-[17px] font-bold leading-snug text-[#0A0A0F] line-clamp-2 transition-colors group-hover:text-[#4338FF]">
              {tutorial.title}
            </h3>
            {tutorial.description && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#0A0A0F]/55 line-clamp-2">
                {tutorial.description}
              </p>
            )}

            {tutorial.topics && tutorial.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tutorial.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-[#0A0A0F]/[0.04] px-2 py-0.5 font-code text-[9px] uppercase tracking-wide text-[#0A0A0F]/45"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#0A0A0F]/8 pt-3">
            <div className="flex items-center gap-3 font-code text-[10px] uppercase tracking-wider text-[#0A0A0F]/40">
              {tutorial.duration_text && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tutorial.duration_text}
                </span>
              )}
              {tutorial.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#D97706] text-[#D97706]" />
                  {tutorial.rating}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 font-code text-[10px] font-bold uppercase tracking-wider text-[#4338FF] opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              View
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
