import { isRichTextEmpty } from "@/lib/rich-text";

type HtmlContentProps = {
  html: string | null | undefined;
  className?: string;
  emptyFallback?: string;
};

/** Renders trusted admin-authored HTML (product descriptions, etc.). */
export default function HtmlContent({
  html,
  className = "",
  emptyFallback = "",
}: HtmlContentProps) {
  if (isRichTextEmpty(html)) {
    return emptyFallback ? (
      <p className={className}>{emptyFallback}</p>
    ) : null;
  }

  return (
    <div
      className={`prose prose-sm max-w-none text-default-600 ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}
