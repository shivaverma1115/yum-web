"use client";

export default function BackToTop() {
  return (
    <div className="fixed lg:bottom-5 end-5 bottom-18 flex flex-col items-center bg-primary/25 rounded-full z-10">
      <button
        type="button"
        className="h-0 w-8 opacity-0 flex justify-center items-center transition-all duration-500 translate-y-5 z-10"
        data-toggle="back-to-top"
        aria-label="Back to top"
      >
        <i className="h-5 w-5 text-primary-500 mt-1" data-lucide="chevron-up" />
      </button>
    </div>
  );
}
