import React from 'react';
import MathRichTextEditor from '@/components/MathRichTextEditor';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  minHeight?: string;
}

export default function ContentEditor({ content, onChange, minHeight = "min-h-[500px]" }: ContentEditorProps) {
  return (
    <MathRichTextEditor
      value={content}
      onChange={onChange}
      withPreview={true}
      minHeight={minHeight}
      className="w-full"
    />
  );
}
