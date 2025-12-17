import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { ReactNode } from "react";

interface MathProps {
  children: string;
  display?: boolean;
}

// Simple inline math component
export const Math = ({ children, display = false }: MathProps) => {
  if (display) {
    return (
      <div className="my-4 overflow-x-auto py-2">
        <BlockMath math={children} />
      </div>
    );
  }
  return <InlineMath math={children} />;
};

// Inline math shorthand
export const M = ({ children }: { children: string }) => (
  <InlineMath math={children} />
);

// Display/block math shorthand
export const MathBlock = ({ children }: { children: string }) => (
  <div className="my-4 overflow-x-auto py-2">
    <BlockMath math={children} />
  </div>
);

// Note boxes for mathematical content
interface NoteBoxProps {
  title?: string;
  children: ReactNode;
  variant?: "definition" | "theorem" | "example" | "warning";
}

export const NoteBox = ({ title, children, variant = "definition" }: NoteBoxProps) => {
  const variantClasses = {
    definition: "definition-box",
    theorem: "theorem-box",
    example: "example-box",
    warning: "warning-box",
  };

  const titleColors = {
    definition: "text-definition-border",
    theorem: "text-theorem-border",
    example: "text-example-border",
    warning: "text-warning-border",
  };

  return (
    <div className={variantClasses[variant]}>
      {title && (
        <h4 className={`font-semibold mb-2 ${titleColors[variant]}`}>{title}</h4>
      )}
      <div className="font-serif leading-relaxed">{children}</div>
    </div>
  );
};

// Definition box
export const Definition = ({ title, children }: { title?: string; children: ReactNode }) => (
  <NoteBox variant="definition" title={title || "Definition"}>
    {children}
  </NoteBox>
);

// Theorem box
export const Theorem = ({ title, children }: { title?: string; children: ReactNode }) => (
  <NoteBox variant="theorem" title={title || "Theorem"}>
    {children}
  </NoteBox>
);

// Example box
export const Example = ({ title, children }: { title?: string; children: ReactNode }) => (
  <NoteBox variant="example" title={title || "Example"}>
    {children}
  </NoteBox>
);

// Warning box
export const Warning = ({ title, children }: { title?: string; children: ReactNode }) => (
  <NoteBox variant="warning" title={title || "Warning"}>
    {children}
  </NoteBox>
);

export default Math;
