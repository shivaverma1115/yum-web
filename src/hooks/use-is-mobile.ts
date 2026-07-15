"use client";

import { useEffect, useState } from "react";

/** Match Tailwind `md` (768px): below = mobile view */
const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile(defaultValue = false) {
  const [isMobile, setIsMobile] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mql.matches);

    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
