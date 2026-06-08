/** True when Quill/HTML content has no meaningful text. */
export function isRichTextEmpty(value: string | null | undefined): boolean {
  if (!value?.trim()) return true;

  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length === 0;
}

export function normalizeRichTextValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<p></p>") {
    return "";
  }
  return trimmed;
}
