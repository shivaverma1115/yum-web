"use client";

import Link from "next/link";
import {
    Bell,
    Globe,
    LogOut,
    Maximize,
    Menu,
    Newspaper,
    Search,
    Settings,
    User,
} from "lucide-react";
import { useContextApi } from "@/context-api/use-context";
import { useLogout } from "@/lib/auth/useLogout";
import UserAvatar from "@/components/common/UserAvatar";
import { ProfileUserChipSkeleton } from "@/components/skeleton";
import { getUserDisplayName } from "@/lib/user/display-name";
import RunningTruncate from "@/components/ui/RunningTruncate";
import { UserRole } from "@/types/user";

type ProfileTopbarProps = {
    onMenuClick?: () => void;
};

export default function ProfileTopbar({ onMenuClick }: ProfileTopbarProps) {
    const { user, loading } = useContextApi();
    const handleLogout = useLogout();
    const isSessionLoading = loading && !user;

    const isAdmin = user?.role === UserRole.ADMIN;
    const dashboardHref = isAdmin ? "/admin/dashboard" : "/user/orders";
    const settingsHref = isAdmin ? "/admin/settings" : "/user/settings";
    const displayName = user ? getUserDisplayName(user) : "Account";
    const roleLabel = isAdmin ? "Admin" : "User";

    return (
        <header className="sticky top-0 z-40 flex h-18 w-full border-b border-default-200 bg-white dark:bg-default-50 lg:ps-64">
            <nav className="flex w-full items-center gap-4 px-6">
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="text-default-500 hover:text-default-600"
                        aria-controls="application-sidebar"
                        aria-label="Toggle navigation"
                        onClick={onMenuClick}
                    >
                        <Menu className="size-6" aria-hidden />
                    </button>
                </div>

                <div className="flex lg:hidden">
                    <Link href={dashboardHref}>
                        <img
                            src="/images/logo-dark(1).png"
                            alt="Yum logo"
                            className="flex h-10 w-full dark:hidden"
                        />
                        <img
                            src="/images/logo-light(1).png"
                            alt="Yum logo"
                            className="hidden h-10 w-full dark:flex"
                        />
                    </Link>
                </div>

                <div className="relative hidden lg:flex">
                    <label htmlFor="profile-topbar-search" className="sr-only">
                        Search
                    </label>
                    <input
                        id="profile-topbar-search"
                        type="search"
                        className="block w-64 rounded-full border-default-200 bg-default-50 py-2.5 pe-4 ps-12 text-sm text-default-600 ring-0 focus:border-primary focus:ring-primary"
                        placeholder="Search for items..."
                    />
                    <span className="absolute start-4 top-2.5">
                        <Search className="h-5 w-5 text-default-600" aria-hidden />
                    </span>
                </div>

                <div className="ms-auto flex items-center gap-4">
                    <div className="hidden lg:flex">
                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button
                                type="button"
                                className="hs-dropdown-toggle inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-default-100 text-xs font-medium text-default-700 transition-all hover:text-primary"
                                aria-label="Language"
                            >
                                <Globe className="h-5 w-5" aria-hidden />
                            </button>

                            <div className="hs-dropdown-menu mt-2 hidden min-w-48 rounded-lg border border-default-200 bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] duration hs-dropdown-open:opacity-100 dark:bg-default-50">
                                <span className="flex items-center gap-x-3.5 rounded px-3 py-2 text-sm text-default-500">
                                    English (default)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex">
                        <button
                            type="button"
                            data-toggle="fullscreen"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-default-100 text-xs font-medium text-default-700 transition-all hover:text-primary"
                            aria-label="Toggle fullscreen"
                        >
                            <Maximize className="h-5 w-5" aria-hidden />
                        </button>
                    </div>

                    <div className="hidden md:flex">
                        <Link
                            href={settingsHref}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-default-100 text-xs font-medium text-default-700 transition-all hover:text-primary"
                            aria-label="Settings"
                        >
                            <Settings className="h-5 w-5" aria-hidden />
                        </Link>
                    </div>

                    <div className="hidden md:flex">
                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button
                                type="button"
                                className="hs-dropdown-toggle relative inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-default-100 text-xs font-medium text-default-700 transition-all hover:text-primary"
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" aria-hidden />
                            </button>

                            <div className="hs-dropdown-menu mt-2 hidden min-w-80 rounded-lg border border-default-200 bg-white opacity-0 shadow-md transition-[opacity,margin] duration hs-dropdown-open:opacity-100 dark:bg-default-50">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <h6 className="text-sm font-medium">Notifications</h6>
                                </div>
                                <div className="border-y border-dashed border-default-200 p-4">
                                    <p className="text-sm text-default-500">No new notifications.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        {isSessionLoading ? (
                            <ProfileUserChipSkeleton />
                        ) : (
                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button
                                type="button"
                                className="hs-dropdown-toggle inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-xs font-medium text-default-700 transition-all"
                                aria-label="Account menu"
                            >
                                <UserAvatar
                                    user={user}
                                    className="inline-block h-10 w-10 rounded-full object-cover"
                                />
                                <div className="hidden text-start lg:block">
                                    <p className="text-sm font-medium text-default-700">
                                        <RunningTruncate
                                            text={displayName}
                                            maxWidthClassName="max-w-[9rem]"
                                        />
                                    </p>
                                    <p className="mt-1 text-xs text-default-500">{roleLabel}</p>
                                </div>
                            </button>

                            <div className="hs-dropdown-menu mt-2 hidden min-w-48 rounded-lg border border-default-200 bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] duration hs-dropdown-open:opacity-100 dark:bg-default-50">
                                <Link
                                    href={settingsHref}
                                    className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-default-800 transition-all hover:bg-default-100"
                                >
                                    <User className="h-4 w-4 shrink-0" aria-hidden />
                                    My Profile
                                </Link>
                                <Link
                                    href="/home"
                                    target="_blank"
                                    className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-default-800 transition-all hover:bg-default-100"
                                >
                                    <Newspaper className="h-4 w-4 shrink-0" aria-hidden />
                                    Landing
                                </Link>
                                <Link
                                    href={settingsHref}
                                    className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-default-800 transition-all hover:bg-default-100"
                                >
                                    <Settings className="h-4 w-4 shrink-0" aria-hidden />
                                    Settings
                                </Link>

                                <hr className="-mx-2 my-2 border-default-200" />

                                <button
                                    type="button"
                                    onClick={() => void handleLogout()}
                                    className="flex w-full items-center gap-x-3.5 rounded-md px-3 py-2 text-start text-sm text-red-400 transition-all hover:bg-red-400/10"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                                    Log out
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
