"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

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
        <i
          data-lucide="chevron-down"
          className={`w-4 h-4 ms-auto transition-all${isOpen ? " rotate-180" : ""}`}
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

const SECTIONS = [
  { id: "menuOrders", prefix: "/admin/orders" },
  { id: "menuCustomers", prefix: "/admin/customers" },
  { id: "menuRestaurants", prefix: "/admin/restaurants" },
  { id: "menuProduct", prefix: "/admin/products" },
  { id: "menuSeller", prefix: "/admin/sellers" },
] as const;

function getOpenSectionForPath(pathname: string): string | null {
  const match = SECTIONS.find(
    ({ prefix }) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.id ?? null;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSectionId, setOpenSectionId] = useState<string | null>(() =>
    getOpenSectionForPath(pathname),
  );

  useEffect(() => {
    const sectionForPath = getOpenSectionForPath(pathname);
    if (sectionForPath) {
      setOpenSectionId(sectionForPath);
    }
  }, [pathname]);

  const handleToggle = (sectionId: string) => {
    setOpenSectionId((current) =>
      current === sectionId ? null : sectionId,
    );
  };

  return (
    <div>
      <div
        id="application-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed inset-y-0 start-0 z-60 w-64 bg-white border-e border-default-200 overflow-y-auto lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:bg-default-50"
      >
        <div className="flex sticky top-0 items-center justify-center px-6 h-18 border-b border-dashed border-default-200">
          <Link href="/admin/dashboard" className="inline-flex shrink-0">
            <img
              src="/images/logo-dark.png"
              alt="logo"
              className="h-10 flex dark:hidden"
            />
            <img
              src="/images/logo-light.png"
              alt="logo"
              className="h-10 hidden dark:flex"
            />
          </Link>
        </div>

        <div className="h-[calc(100%-390px)]" data-simplebar>
          <ul className="admin-menu p-4 w-full flex flex-col gap-1.5">
            <NavLink href="/admin/dashboard">
              <i data-lucide="layout-grid" className="w-5 h-5 shrink-0" />
              Dashboard
            </NavLink>

            <NavLink href="/admin/manage">
              <i data-lucide="settings-2" className="w-5 h-5 shrink-0" />
              Manage
            </NavLink>

            <CollapsibleNavSection
              id="menuOrders"
              label="Orders"
              sectionPrefix="/admin/orders"
              openSectionId={openSectionId}
              onToggle={handleToggle}
              icon={
                <i data-lucide="list-ordered" className="w-5 h-5 shrink-0" />
              }
            >
              <SubNavLink href="/admin/orders">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Order List
              </SubNavLink>
              <SubNavLink href="/admin/orders/1">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Order Details
              </SubNavLink>
            </CollapsibleNavSection>

            <CollapsibleNavSection
              id="menuCustomers"
              label="Customers"
              sectionPrefix="/admin/customers"
              openSectionId={openSectionId}
              onToggle={handleToggle}
              icon={<i data-lucide="users" className="w-5 h-5 shrink-0" />}
            >
              <SubNavLink href="/admin/customers">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Customers List
              </SubNavLink>
              <SubNavLink href="/admin/customers/1">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Customers Details
              </SubNavLink>
              <SubNavLink href="/admin/customers/add">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Customers Add
              </SubNavLink>
              <SubNavLink href="/admin/customers/1/edit">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Customers Edit
              </SubNavLink>
            </CollapsibleNavSection>

            <CollapsibleNavSection
              id="menuRestaurants"
              label="Restaurants"
              sectionPrefix="/admin/restaurants"
              openSectionId={openSectionId}
              onToggle={handleToggle}
              icon={<i data-lucide="hotel" className="w-5 h-5 shrink-0" />}
            >
              <SubNavLink href="/admin/restaurants">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Restaurants List
              </SubNavLink>
              <SubNavLink href="/admin/restaurants/1">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Restaurants Details
              </SubNavLink>
              <SubNavLink href="/admin/restaurants/add">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Restaurants Add
              </SubNavLink>
              <SubNavLink href="/admin/restaurants/1/edit">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Restaurants Edit
              </SubNavLink>
            </CollapsibleNavSection>

            <CollapsibleNavSection
              id="menuProduct"
              label="Product"
              sectionPrefix="/admin/products"
              openSectionId={openSectionId}
              onToggle={handleToggle}
              icon={
                <i data-lucide="shopping-bag" className="w-5 h-5 shrink-0" />
              }
            >
              <SubNavLink href="/admin/products">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Product List
              </SubNavLink>
              <SubNavLink href="/admin/products/1">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Product Details
              </SubNavLink>
              <SubNavLink href="/admin/products/add">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Product Add
              </SubNavLink>
              <SubNavLink href="/admin/products/1/edit">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Product Edit
              </SubNavLink>
            </CollapsibleNavSection>

            <CollapsibleNavSection
              id="menuSeller"
              label="Seller"
              sectionPrefix="/admin/sellers"
              openSectionId={openSectionId}
              onToggle={handleToggle}
              icon={<i data-lucide="user-cog" className="w-5 h-5 shrink-0" />}
            >
              <SubNavLink href="/admin/sellers">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Seller List
              </SubNavLink>
              <SubNavLink href="/admin/sellers/1">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Seller Details
              </SubNavLink>
              <SubNavLink href="/admin/sellers/add">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Seller Add
              </SubNavLink>
              <SubNavLink href="/admin/sellers/1/edit">
                <i data-lucide="dot" className="w-6 h-6 shrink-0" />
                Seller Edit
              </SubNavLink>
            </CollapsibleNavSection>

            <NavLink href="/admin/wallet">
              <i data-lucide="wallet" className="w-5 h-5 shrink-0" />
              Wallet
            </NavLink>
          </ul>
        </div>

        <ul className="admin-menu flex flex-col gap-2 px-4 pt-10">
          <li className="menu-item">
            <div
              className="flex flex-col items-center rounded-md bg-primary/5 bg-cover bg-no-repeat p-4 text-center text-sm text-default-700"
              style={{ backgroundImage: "url('/images/other/offer-bg.png')" }}
            >
              <div className="-mt-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-default-100 bg-white text-primary shadow-lg dark:bg-default-50">
                <i data-lucide="headphones" className="h-6 w-6" />
              </div>
              <p className="mb-4 text-sm text-default-700">
                🔥 Upgrade Your Plan. Find Out here
              </p>
              <button
                type="button"
                className="rounded bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
              >
                Contact Support
              </button>
            </div>
          </li>

          <NavLink href="/admin/settings">
            <i data-lucide="settings" className="w-5 h-5 shrink-0" />
            Settings
          </NavLink>

          <li className="menu-item">
            <Link
              href="/login"
              className="flex items-center gap-x-3.5 rounded-md px-4 py-3 text-sm text-red-700 hover:bg-red-400/10 hover:text-red-800"
            >
              <i data-lucide="log-out" className="w-5 h-5 shrink-0" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
