"use client";

import { useEffect, useId, useRef } from "react";
import type Quill from "quill";
import { normalizeRichTextValue } from "@/lib/rich-text";

type ToolbarPreset = "minimal" | "standard" | "full";

export type RichTextEditorProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: number;
  toolbar?: ToolbarPreset | (string | Record<string, unknown>)[][];
};

const TOOLBAR_PRESETS: Record<ToolbarPreset, (string | Record<string, unknown>)[][]> = {
  minimal: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
  standard: [
    ["bold", "italic", "underline", "strike"],
    [{ header: [2, 3, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote"],
    ["clean"],
  ],
  full: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote"],
    ["clean"],
  ],
};

export default function RichTextEditor({
  id,
  value = "",
  onChange,
  onBlur,
  placeholder = "Write something...",
  disabled = false,
  className = "",
  minHeight = 140,
  toolbar = "standard",
}: RichTextEditorProps) {
  const generatedId = useId();
  const editorId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  const initialValueRef = useRef(value);
  const toolbarRef = useRef(toolbar);
  const placeholderRef = useRef(placeholder);

  onChangeRef.current = onChange;
  onBlurRef.current = onBlur;
  toolbarRef.current = toolbar;
  placeholderRef.current = placeholder;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || quillRef.current) return;

    let disposed = false;

    const initEditor = async () => {
      const { default: Quill } = await import("quill");
      if (disposed || !containerRef.current || quillRef.current) return;

      const editorElement = document.createElement("div");
      editorElement.id = editorId;
      container.appendChild(editorElement);

      const toolbarConfig = Array.isArray(toolbarRef.current)
        ? toolbarRef.current
        : TOOLBAR_PRESETS[toolbarRef.current];

      const quill = new Quill(editorElement, {
        theme: "snow",
        placeholder: placeholderRef.current,
        modules: {
          toolbar: toolbarConfig,
        },
      });

      quillRef.current = quill;

      if (initialValueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(initialValueRef.current);
      }

      const handleTextChange = () => {
        const html = normalizeRichTextValue(quill.root.innerHTML);
        onChangeRef.current?.(html);
      };

      const handleBlur = () => {
        onBlurRef.current?.();
      };

      quill.on("text-change", handleTextChange);
      quill.root.addEventListener("blur", handleBlur);
    };

    void initEditor();

    return () => {
      disposed = true;
      const quill = quillRef.current;
      if (quill) {
        quillRef.current = null;
      }
      container.innerHTML = "";
    };
  }, [editorId]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const next = value ?? "";
    const current = normalizeRichTextValue(quill.root.innerHTML);
    if (current !== next) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(next);
      if (selection) {
        quill.setSelection(selection);
      }
    }
  }, [value]);

  useEffect(() => {
    quillRef.current?.enable(!disabled);
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={`rich-text-editor overflow-hidden rounded-lg bg-transparent ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`.trim()}
      style={{ ["--editor-min-height" as string]: `${minHeight}px` }}
    />
  );
}
