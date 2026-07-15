"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Headphones,
  Hotel,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Settings,
  Settings2,
  ShoppingBag,
  UserCog,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLogout } from "@/lib/auth/useLogout";
import {
  ADMIN_NAV_ITEMS,
  getOpenSectionForPath,
  USER_NAV_ITEMS,
} from "@/lib/profile-navigation";
import { useContextApi } from "@/context-api/use-context";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import { ProfileNavSkeleton } from "@/components/skeleton";
import ThemeToggle from "./ThemeToggle";

const navLinkClass =
  "flex items-center gap-x-3.5 py-3 px-4 text-sm text-default-700 rounded-md hover:bg-default-100";

const subNavLinkClass =
  "flex w-full items-center gap-x-2.5 py-2 px-4 text-sm text-default-700 rounded-md hover:bg-default-100";

const collapseToggleClass =
  "hs-collapse-toggle flex w-full cursor-pointer items-center gap-x-3.5 border-0 bg-transparent py-3 px-4 text-start text-sm text-default-700 rounded-md hover:bg-default-100";

const activeNavClass = "!text-primary !bg-primary/10";
const activeToggleClass = "!text-default-700 !bg-default-200/50";

function isActivePath(pathname: string, href: string) {
  return pathname === href;
}

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  "layout-grid": LayoutGrid,
  "settings-2": Settings2,
  "list-ordered": ListOrdered,
  users: Users,
  hotel: Hotel,
  "shopping-bag": ShoppingBag,
  "user-cog": UserCog,
  wallet: Wallet,
  settings: Settings,
  "log-out": LogOut,
  headphones: Headphones,
};

function NavIcon({
  name,
  className = "w-5 h-5 shrink-0",
}: {
  name: string;
  className?: string;
}) {
  const Icon = NAV_ICON_MAP[name];
  if (!Icon) return null;

  return <Icon className={className} aria-hidden />;
}

function SubNavBullet() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
      <span
        className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
        aria-hidden
      />
    </span>
  );
}

function CollapsibleNavSection({
  id,
  label,
  icon,
  sectionPrefix,
  children,
  openSectionId,
  onToggle,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  sectionPrefix: string;
  children: ReactNode;
  openSectionId: string | null;
  onToggle: (sectionId: string) => void;
}) {
  const pathname = usePathname();
  const sectionActive = isActivePath(pathname, sectionPrefix);
  const isOpen = openSectionId === id;

  return (
    <li className="menu-item">
      <button
        type="button"
        className={`${collapseToggleClass}${sectionActive && !isOpen ? ` ${activeToggleClass}` : ""}${isOpen ? ` ${activeToggleClass}` : ""}`}
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => onToggle(id)}
      >
        {icon}
        {label}
        <ChevronDown
          className={`ms-auto h-4 w-4 shrink-0 transition-transform duration-300${isOpen ? " rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        id={id}
        className={`w-full overflow-hidden transition-[height] duration-300${isOpen ? "" : " hidden"}`}
      >
        <ul className="mt-2 space-y-2">{children}</ul>
      </div>
    </li>
  );
}

function SubNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <li className="menu-item">
      <Link
        href={href}
        className={`${subNavLinkClass}${active ? ` ${activeNavClass}` : ""}`}
      >
        {children}
      </Link>
    </li>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <li className="menu-item">
      <Link
        href={href}
        className={`${navLinkClass}${active ? ` ${activeNavClass}` : ""}`}
      >
        {children}
      </Link>
    </li>
  );
}

type AdminNavMenuProps = {
  openSectionId: string | null;
  onToggle: (sectionId: string) => void;
  isAdmin: boolean;
};

function AdminNavMenu({ openSectionId, onToggle, isAdmin }: AdminNavMenuProps) {
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
  return (
    <>
      {navItems.map((item) => {
        if (item.type === "link") {
          return (
            <NavLink key={item.href} href={item.href}>
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          );
        }

        return (
          <CollapsibleNavSection
            key={item.id}
            id={item.id}
            label={item.label}
            sectionPrefix={item.prefix}
            openSectionId={openSectionId}
            onToggle={onToggle}
            icon={<NavIcon name={item.icon} />}
          >
            {item.children.map((child) => (
              <SubNavLink key={child.href} href={child.href}>
                <SubNavBullet />
                {child.label}
              </SubNavLink>
            ))}
          </CollapsibleNavSection>
        );
      })}
    </>
  );
}

type ProfileSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function ProfileSidebar({
  mobileOpen = false,
  onMobileClose,
}: ProfileSidebarProps) {
  const { user, loading } = useContextApi();
  const { settings: businessSettings } = useBusinessSettings();
  const isSessionLoading = loading && !user;
  const isAdmin = user?.role === "admin";
  const pathname = usePathname();
  const handleLogout = useLogout();
  const [openSectionId, setOpenSectionId] = useState<string | null>(() =>
    getOpenSectionForPath(pathname),
  );

  useEffect(() => {
    const sectionForPath = getOpenSectionForPath(pathname);
    if (sectionForPath) {
      setOpenSectionId(sectionForPath);
    }
  }, [pathname]);

  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const handleToggle = (sectionId: string) => {
    setOpenSectionId((current) =>
      current === sectionId ? null : sectionId,
    );
  };

  return (
    <div>
      <div
        id="application-sidebar"
        className={`fixed inset-y-0 start-0 z-[60] w-64 transform border-e border-default-200 bg-white transition-all duration-300 overflow-y-auto dark:bg-default-50 lg:bottom-0 lg:right-auto lg:block lg:translate-x-0 ${mobileOpen
          ? "translate-x-0"
          : "-translate-x-full pointer-events-none lg:pointer-events-auto"
          }`}
      >
        <div className="sticky top-0 flex h-18 items-center justify-between border-b border-dashed border-default-200 px-6">
          <Link href={`/${user?.role}/dashboard`} className="inline-flex shrink-0 items-center gap-2">
            <img
              src="/images/logo-dark(1).png"
              alt="logo"
              className="h-10 flex dark:hidden"
            />
            <img
              src="/images/logo-light(1).png"
              alt="logo"
              className="h-10 hidden dark:flex"
            />
            <span className="text-4xl font-bold">{businessSettings.general.site_name}</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-default-500 hover:text-default-700 lg:hidden"
            aria-label="Close sidebar"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          key={isSessionLoading ? "nav-loading" : "nav-ready"}
          className="h-[calc(100%-390px)]"
          data-simplebar
        >
          {isSessionLoading ? (
            <ProfileNavSkeleton />
          ) : (
            <ul className="admin-menu p-4 w-full flex flex-col gap-1.5">
              <AdminNavMenu
                openSectionId={openSectionId}
                onToggle={handleToggle}
                isAdmin={isAdmin}
              />
            </ul>
          )}
        </div>

        <ul className="admin-menu flex flex-col gap-2 px-4 pt-10">
          {isSessionLoading ? (
            <ProfileNavSkeleton rows={2} />
          ) : (
            <>
          <NavLink href={isAdmin ? "/admin/settings" : "/user/settings"}>
            <NavIcon name="settings" />
            Settings
          </NavLink>

          <li className="menu-item">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-x-3.5 rounded-md px-4 py-3 text-sm text-red-700 hover:bg-red-400/10 hover:text-red-800"
            >
              <NavIcon name="log-out" />
              Logout
            </button>
          </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
