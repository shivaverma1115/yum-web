"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils/helpers";

type RunningTruncateProps = {
  text: string;
  className?: string;
  /** Max width of the visible window (Tailwind width class). */
  maxWidthClassName?: string;
};

/**
 * Keeps a fixed-width label and scrolls long text so the full string is readable.
 */
export default function RunningTruncate({
  text,
  className,
  maxWidthClassName = "max-w-[3.5rem]",
}: RunningTruncateProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shiftPx, setShiftPx] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const label = textRef.current;
    if (!container || !label) return;

    const measure = () => {
      const overflow = Math.max(0, label.scrollWidth - container.clientWidth);
      setShiftPx(overflow);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(label);

    return () => observer.disconnect();
  }, [text]);

  const shouldRun = shiftPx > 0;

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-block overflow-hidden whitespace-nowrap align-bottom",
        maxWidthClassName,
        className,
      )}
      title={text}
    >
      <span
        ref={textRef}
        className={cn(
          "inline-block will-change-transform",
          shouldRun && "animate-running-truncate",
        )}
        style={
          shouldRun
            ? ({
                ["--rt-shift"]: `-${shiftPx}px`,
                animationDuration: `${Math.max(4, shiftPx / 18)}s`,
              } as CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </span>
  );
}
