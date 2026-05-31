"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      id="preloader"
      className={`fixed inset-0 z-70 bg-default-50 transition-all flex items-center justify-center ${
        hidden ? "invisible opacity-0" : "visible opacity-100"
      } h-screen w-screen`}
    >
      <div
        className="animate-spin inline-block w-10 h-10 border-4 border-t-transparent border-primary rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
