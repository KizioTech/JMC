import { motion } from "framer-motion";
import { Clock, Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CatalogTag, { subjectCode } from "@/components/CatalogTag";
import SubjectArt from "@/components/library/SubjectArt";
import type { CourseRow } from "@/services/courseService";

const LEVEL_STYLE: Record<string, string> = {
  Beginner: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/15",
  Intermediate: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/15",
  Advanced: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/15",
};

interface CourseCardProps {
  course: CourseRow;
  position: number;
  onEnroll?: () => void;
}

export default function CourseCard({ course, position, onEnroll }: CourseCardProps) {
  const code = subjectCode(course.title);
  const levelStyle = LEVEL_STYLE[course.level || ""] || "bg-[#0A0A0F]/5 text-[#0A0A0F]/45 border-[#0A0A0F]/10";

  return (
    <motion.div
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0A0A0F]/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_32px_-12px_rgba(10,10,15,0.16)]"
    >
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-[#F5F6FA]">
        {course.cover_image ? (
          <img
            src={course.cover_image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <SubjectArt subject={course.title} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
        <div className="absolute left-3.5 top-3.5">
          <CatalogTag code={code} index={position} tone="white" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            {course.level && (
              <Badge
                variant="outline"
                className={cn("rounded-full px-2 py-0 font-code text-[10px] font-medium tracking-wide", levelStyle)}
              >
                {course.level}
              </Badge>
            )}
            {course.duration_weeks && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-[#0A0A0F]/10 bg-[#0A0A0F]/[0.03] px-2 py-0 font-code text-[10px] font-medium tracking-wide text-[#0A0A0F]/55"
              >
                <Clock className="h-2.5 w-2.5" />
                {course.duration_weeks}w
              </Badge>
            )}
          </div>

          <h3 className="font-inter text-[17px] font-bold leading-snug text-[#0A0A0F] line-clamp-2 transition-colors group-hover:text-[#4338FF]">
            {course.title}
          </h3>
          {course.description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#0A0A0F]/55 line-clamp-2">{course.description}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#0A0A0F]/8 pt-3">
          <span className="flex items-center gap-1 font-code text-[10px] uppercase tracking-wider text-[#0A0A0F]/40">
            <Layers className="h-3 w-3" />
            Course
          </span>
          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center gap-1 font-code text-[10px] font-bold uppercase tracking-wider text-[#4338FF] transition-all hover:gap-1.5"
          >
            Enroll
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
