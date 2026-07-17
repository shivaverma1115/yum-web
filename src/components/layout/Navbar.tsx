"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import { useLogout } from "@/lib/auth/useLogout";
import { UserRole } from "@/types/user";
import { getUserDisplayName } from "@/lib/user/display-name";
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { SkeletonBox } from "@/components/skeleton";
import RunningTruncate from "@/components/ui/RunningTruncate";
import {
    ChevronDown,
    Heart,
    Home,
    Menu,
    User,
    Utensils,
    X,
} from "lucide-react";
import { useBusinessSettings } from '@/context-api/business-settings-context';
import ThemeToggle from './ThemeToggle';

function isActivePath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
    const pathname = usePathname();
    const handleLogout = useLogout();
    const { user, isAuthenticated, isAnonymous, loading } = useContextApi();
    const { settings: businessSettings } = useBusinessSettings();
    const { itemCount } = useCart();
    const isSessionLoading = loading && !user;
    const isAdmin = user?.role === UserRole.ADMIN;
    const canLogout = isAuthenticated && !isAnonymous;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        setIsProductMenuOpen(false);
    }, []);

    useEffect(() => {
        closeMobileMenu();
    }, [pathname, closeMobileMenu]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        let cancelled = false;

        async function initPreline() {
            try {
                const { HSStaticMethods } = await import("preline/preline");
                if (cancelled) return;
                HSStaticMethods.autoInit();
            } catch (error) {
                console.error("Preline init failed:", error);
            }
        }

        void initPreline();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="sticky top-0 left-0 right-0 z-20">
            <div className="h-8 lg:flex items-center hidden bg-primary-950 text-white z-20">
                <div className="container">
                    <nav className="grid lg:grid-cols-3 items-center gap-4">
                        <div className="flex relative">
                            <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base" href="/">
                                    <img alt="Image" className="h-3.5 me-3" src="/images/flags/in.jpeg" />
                                    <span className="font-medium text-xs">English (India)</span>
                                </Link>
                            </div>
                        </div>

                        <h5 className="text-sm text-primary-50 text-center">Free Delivery Over {CURRENCY_SYMBOL}50 <Link className="font-semibold underline" href="#">Claim Offer</Link></h5>

                        <ul className="flex items-center justify-end gap-4">
                            <li className="flex menu-item">
                                <Link className="text-sm hover:text-primary" href="/faqs">Help</Link>
                            </li>

                            <li className="flex menu-item">
                                <Link className="text-sm hover:text-primary" href="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <header id="navbar" className="sticky top-0 z-20 border-b border-default-200 bg-transparent transition-all">
                <div className="lg:h-20 h-14 flex items-center">
                    <div className="container">
                        <div className="grid lg:grid-cols-3 grid-cols-2 items-center gap-4">
                            <div className="flex">
                                <button
                                    className="lg:hidden block"
                                    type="button"
                                    aria-label="Open menu"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <Menu className="w-7 h-7 text-default-600 me-4 hover:text-primary" aria-hidden />
                                </button>

                                <Link href="/home" className="flex items-center gap-2">
                                    <img src="/images/logo-dark(1).png" alt="logo" className="h-10 flex dark:hidden" />
                                    <img src="/images/logo-light(1).png" alt="logo" className="h-10 hidden dark:flex" />
                                    <span className="text-4xl font-bold w-full">
                                        <RunningTruncate
                                            text={businessSettings.general.site_name}
                                            maxWidthClassName="max-w-[6rem]"
                                        />
                                    </span>
                                </Link>
                            </div>

                            <ul className="menu lg:flex items-center justify-center hidden relative">
                                <li className="menu-item">
                                    <Link className="inline-flex items-center text-sm lg:text-base font-medium text-default-800 py-2 px-4 rounded-full hover:text-primary " href="/products">Products </Link>
                                </li>

                                {isAdmin ? (
                                    <li className="menu-item">
                                        <Link className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="/admin/dashboard">Admin</Link>
                                    </li>
                                ) : null}
                                {canLogout && (
                                    <li className="menu-item">
                                        <button
                                            type="button"
                                            className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                )}
                            </ul>

                            <ul className="flex items-center justify-end gap-x-6">
                                <li className="2xl:flex relative menu-item hidden">
                                    <input className="ps-10 pe-4 py-2.5 block w-64 border-transparent placeholder-primary-500 rounded-full text-sm ring-0 bg-primary-400/15 text-primary" placeholder="Search for items..." type="search" />
                                    <span className="absolute start-4 top-3">
                                        <i className="w-4 h-4 text-primary-500" data-lucide="search"></i>
                                    </span>
                                </li>

                                <li className="flex menu-item">
                                    <Link href="/cart" className="relative flex text-base transition-all text-default-600 hover:text-primary">
                                        <i className="w-5 h-5" data-lucide="shopping-bag"></i>
                                        {itemCount > 0 ? (
                                            <span className="absolute z-10 -top-2.5 end-0 inline-flex items-center justify-center p-1 min-h-5 min-w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full px-1">
                                                {itemCount > 99 ? "99+" : itemCount}
                                            </span>
                                        ) : null}
                                    </Link>
                                </li>

                                <li className="flex menu-item">
                                    {isSessionLoading ? (
                                        <div className="inline-flex items-center gap-2" aria-busy="true">
                                            <SkeletonBox className="h-5 w-5 rounded" />
                                            <SkeletonBox className="skel-line-sm h-3 w-16" />
                                        </div>
                                    ) : (
                                        <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                            <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base transition-all text-default-600 hover:text-primary"
                                                href={`${user ? (isAdmin ? "/admin/settings" : "/user/settings") : "/login"}`}
                                            >
                                                <User className="size-5 mr-2 shrink-0" />
                                                {user ? (
                                                    <RunningTruncate text={getUserDisplayName(user)} />
                                                ) : (
                                                    "Login"
                                                )}
                                            </Link>

                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                <ul className="flex flex-col gap-1">
                                                    {user ? (
                                                        <li className="px-3 py-2 text-sm font-medium text-default-800">
                                                            <RunningTruncate
                                                                text={getUserDisplayName(user)}
                                                                maxWidthClassName="max-w-full"
                                                            />
                                                        </li>
                                                    ) : null}
                                                    {isAdmin ? (
                                                        <li>
                                                            <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/admin/dashboard"><i className="h-4 w-4" data-lucide="user-circle"></i> Admin</Link>
                                                        </li>
                                                    ) : null}
                                                    <li>
                                                        <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/cart"><i className="h-4 w-4" data-lucide="shopping-cart"></i>
                                                            Cart
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/wishlist"><i className="h-4 w-4" data-lucide="heart"></i>
                                                            Wishlist
                                                        </Link>
                                                    </li>
                                                    {canLogout ? (
                                                        <li>
                                                            <button
                                                                type="button"
                                                                className="flex w-full items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded"
                                                                onClick={handleLogout}
                                                            >
                                                                <i className="h-4 w-4" data-lucide="log-out"></i> Log Out
                                                            </button>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/login"><i className="h-4 w-4" data-lucide="log-in"></i> Log In</Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex lg:hidden">
                <div className="fixed inset-x-0 bottom-0 h-16 w-full grid grid-cols-3 items-center justify-items-center border-t border-default-200 bg-white dark:bg-default-50 z-40">
                    <Link
                        href="/home"
                        className={`flex flex-col items-center justify-center gap-1 ${pathname === "/" || isActivePath(pathname, "/home")
                            ? "text-primary"
                            : "text-default-600"
                            }`}
                    >
                        <Home className="text-lg" aria-hidden />
                        <span className="text-xs font-medium">Home</span>
                    </Link>
                    <Link
                        href="/products"
                        className={`flex flex-col items-center justify-center gap-1 ${isActivePath(pathname, "/products") ? "text-primary" : "text-default-600"
                            }`}
                    >
                        <Utensils className="text-lg" aria-hidden />
                        <span className="text-xs font-medium">Food</span>
                    </Link>
                    <Link
                        href="/wishlist"
                        className={`flex flex-col items-center justify-center gap-1 ${isActivePath(pathname, "/wishlist") ? "text-primary" : "text-default-600"
                            }`}
                    >
                        <Heart className="text-lg" aria-hidden />
                        <span className="text-xs font-medium">Wishlist</span>
                    </Link>
                </div>
            </div>

            {isMobileMenuOpen ? (
                <button
                    type="button"
                    className="fixed inset-0 z-50 bg-default-900/50 lg:hidden"
                    aria-label="Close menu"
                    onClick={closeMobileMenu}
                />
            ) : null}

            <div
                id="mobile-menu"
                className={`fixed top-0 left-0 transition-all transform h-full max-w-[270px] w-full z-60 border-r border-default-200 bg-white dark:bg-default-50 lg:hidden ${isMobileMenuOpen ? "translate-x-0 block" : "-translate-x-full hidden"
                    }`}
                tabIndex={-1}
            >
                <div className="flex justify-between items-center border-b border-dashed border-default-200 h-16 px-4 transition-all duration-300">
                    <Link href="/home" onClick={closeMobileMenu}>
                        <img src="/images/logo-dark(1).png" alt="logo" className="h-10 flex dark:hidden" />
                        <img src="/images/logo-light(1).png" alt="logo" className="h-10 hidden dark:flex" />
                    </Link>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-default-500 hover:text-default-700"
                        aria-label="Close menu"
                        onClick={closeMobileMenu}
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </button>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                    <nav className="p-4 w-full flex flex-col flex-wrap">
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                    href="/home"
                                    onClick={closeMobileMenu}
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    className={`flex w-full items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium rounded-md hover:bg-default-100 ${isProductMenuOpen
                                        ? "text-primary bg-default-100"
                                        : "text-default-700"
                                        }`}
                                    onClick={() => setIsProductMenuOpen((open) => !open)}
                                >
                                    Product
                                    <ChevronDown
                                        className={`w-5 h-5 ms-auto transition-transform ${isProductMenuOpen ? "rotate-180" : ""
                                            }`}
                                        aria-hidden
                                    />
                                </button>

                                {isProductMenuOpen ? (
                                    <ul className="pt-2 ps-2">
                                        <li>
                                            <Link
                                                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                                href="/products"
                                                onClick={closeMobileMenu}
                                            >
                                                All Products
                                            </Link>
                                        </li>
                                    </ul>
                                ) : null}
                            </li>

                            <li>
                                <Link
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                    href="/wishlist"
                                    onClick={closeMobileMenu}
                                >
                                    My Wishlist
                                </Link>
                            </li>

                            <li>
                                <Link
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                    href="/contact"
                                    onClick={closeMobileMenu}
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                    href="/faqs"
                                    onClick={closeMobileMenu}
                                >
                                    FAQs
                                </Link>
                            </li>

                            {isSessionLoading ? (
                                <li className="px-2.5 py-2" aria-busy="true">
                                    <SkeletonBox className="skel-line-sm h-4 w-20" />
                                </li>
                            ) : canLogout ? (
                                <li>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                        onClick={() => {
                                            closeMobileMenu();
                                            void handleLogout();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100"
                                            href="/login"
                                            onClick={closeMobileMenu}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    )
}

