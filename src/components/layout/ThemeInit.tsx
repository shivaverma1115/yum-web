"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createIcons, icons } from "lucide";

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function initLucideIcons() {
  createIcons({
    icons,
    attrs: {
      "stroke-width": 2,
    },
  });
}

function initStickyNav() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (
      document.body.scrollTop >= 75 ||
      document.documentElement.scrollTop >= 75
    ) {
      navbar.classList.add("nav-sticky");
    } else {
      navbar.classList.remove("nav-sticky");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => window.removeEventListener("scroll", onScroll);
}

function initNavLinkActive() {
  const pageUrl = window.location.href.split(/[?#]/)[0];
  const navbarLinks = Array.from(document.querySelectorAll(".menu a"));

  navbarLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;

    if (link.href === pageUrl) {
      link.classList.add("active");

      const parentMenu = link.parentElement?.parentElement?.parentElement;
      if (parentMenu?.classList.contains("menu-item")) {
        parentMenu.querySelector(".hs-dropdown-toggle")?.classList.add("active");
      }

      const parentParentMenu =
        link.parentElement?.parentElement?.parentElement?.parentElement
          ?.parentElement;
      if (parentParentMenu?.classList.contains("menu-item")) {
        parentParentMenu
          .querySelector(".hs-dropdown-toggle")
          ?.classList.add("active");
      }
    }
  });
}

/** Admin sidebar active state + collapses are handled in AdminSidebar (React). */
async function initAdminLinkActive() {
  return;
}

function initBackToTop() {
  const mybutton = document.querySelector('[data-toggle="back-to-top"]');
  if (!mybutton) return;

  const onScroll = () => {
    if (window.pageYOffset > 72) {
      mybutton.classList.remove("opacity-0", "h-0", "translate-y-5");
      mybutton.classList.add("h-8");
    } else {
      mybutton.classList.add("opacity-0", "h-0", "translate-y-5");
      mybutton.classList.remove("h-8");
    }
  };

  const onClick = (e: Event) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  mybutton.addEventListener("click", onClick);
  onScroll();

  return () => {
    window.removeEventListener("scroll", onScroll);
    mybutton.removeEventListener("click", onClick);
  };
}

function initFullscreen() {
  const fullScreenBtn = document.querySelector('[data-toggle="fullscreen"]');
  if (!fullScreenBtn) return;

  const onClick = (e: Event) => {
    e.preventDefault();
    document.body.classList.toggle("fullscreen-enable");

    if (
      !document.fullscreenElement &&
      !(document as Document & { mozFullScreenElement?: Element })
        .mozFullScreenElement &&
      !(document as Document & { webkitFullscreenElement?: Element })
        .webkitFullscreenElement
    ) {
      const docEl = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => void;
        webkitRequestFullscreen?: (allow?: number) => void;
      };

      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      const doc = document as Document & {
        cancelFullScreen?: () => void;
        mozCancelFullScreen?: () => void;
        webkitCancelFullScreen?: () => void;
      };

      if (doc.cancelFullScreen) {
        doc.cancelFullScreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      }
    }
  };

  fullScreenBtn.addEventListener("click", onClick);
  return () => fullScreenBtn.removeEventListener("click", onClick);
}

function initPasswordToggle() {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll("[data-x-password]").forEach((element) => {
    const password = element.querySelector(".form-password") as
      | HTMLInputElement
      | null;
    const passwordEyeOn = element.querySelector(".password-eye-on");
    const passwordEyeOff = element.querySelector(".password-eye-off");

    if (!password || !passwordEyeOn || !passwordEyeOff) return;

    passwordEyeOff.classList.add("hidden");

    const showPassword = () => {
      passwordEyeOn.classList.add("hidden");
      passwordEyeOff.classList.remove("hidden");
      password.type = "text";
    };

    const hidePassword = () => {
      passwordEyeOff.classList.add("hidden");
      passwordEyeOn.classList.remove("hidden");
      password.type = "password";
    };

    passwordEyeOn.addEventListener("click", showPassword);
    passwordEyeOff.addEventListener("click", hidePassword);

    cleanups.push(() => {
      passwordEyeOn.removeEventListener("click", showPassword);
      passwordEyeOff.removeEventListener("click", hidePassword);
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

async function initPreline() {
  const { HSStaticMethods } = await import("preline/preline");
  HSStaticMethods.cleanCollection();
  HSStaticMethods.autoInit();
}

async function cleanupPreline() {
  const { HSStaticMethods } = await import("preline/preline");
  HSStaticMethods.cleanCollection();
}

export default function ThemeInit() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    async function init() {
      await import("simplebar");
      await waitForPaint();

      if (cancelled) return;

      try {
        await initPreline();
      } catch (error) {
        console.error("Preline init failed:", error);
      }

      if (cancelled) return;

      initLucideIcons();
      initNavLinkActive();
      await initAdminLinkActive();

      const stickyCleanup = initStickyNav();
      const backToTopCleanup = initBackToTop();
      const fullscreenCleanup = initFullscreen();
      const passwordCleanup = initPasswordToggle();

      if (stickyCleanup) cleanups.push(stickyCleanup);
      if (backToTopCleanup) cleanups.push(backToTopCleanup);
      if (fullscreenCleanup) cleanups.push(fullscreenCleanup);
      if (passwordCleanup) cleanups.push(passwordCleanup);
    }

    init();

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      cleanupPreline().catch(() => undefined);
    };
  }, [pathname]);

  return null;
}
