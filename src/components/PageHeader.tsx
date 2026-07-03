import { ReactNode } from "react";

interface PageHeaderProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  right?: ReactNode;
}

export default function PageHeader({ index, eyebrow, title, description, right }: PageHeaderProps) {
  return (
    <header className="border-b-2 border-[#0A0A0F] pt-14 pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="font-code text-[11px] font-bold tracking-wide text-white bg-[#4338FF] px-2 py-1">
            {index}
          </span>
          <span className="font-code text-[11px] font-bold tracking-[0.25em] text-[#0A0A0F]/50 uppercase">
            {eyebrow}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="font-inter text-[40px] sm:text-[52px] leading-[0.98] font-bold text-[#0A0A0F] mb-4">
              {title}
            </h1>
            {description && <p className="text-[15px] text-[#0A0A0F]/60 max-w-md">{description}</p>}
          </div>

          {right && <div className="w-full lg:w-80 shrink-0">{right}</div>}
        </div>
      </div>
    </header>
  );
}
