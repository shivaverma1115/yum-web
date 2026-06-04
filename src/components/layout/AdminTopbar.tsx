"use client";

import { useContextApi } from '@/context-api/use-context';
import { MenuIcon } from 'lucide-react';
import React from 'react'

type AdminTopbarProps = {
    onMenuClick?: () => void;
};

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
    const { user } = useContextApi();
    return (
        <div>
            <header className="sticky top-0 h-18 flex z-40 w-full border-b border-default-200 bg-white dark:bg-default-50 lg:ps-64">
                <nav className="flex items-center gap-4 w-full px-6">
                    <div className="lg:hidden flex">
                        <button
                            type="button"
                            className="text-default-500 hover:text-default-600"
                            aria-controls="application-sidebar"
                            aria-label="Toggle navigation"
                            onClick={onMenuClick}
                        >
                            <MenuIcon className="size-6" />
                        </button>
                    </div>

                    <div className="lg:hidden flex">
                        <a href="/admin/dashboard">
                            <img src="/images/logo-dark.png" alt="logo" className="h-10 w-full flex dark:hidden" />
                            <img src="/images/logo-light.png" alt="logo" className="h-10 w-full hidden dark:flex" />
                        </a>
                    </div>

                    <div className="lg:flex hidden">
                        <label htmlFor="icon" className="sr-only">Search</label>
                        <div className="relative lg:flex hidden">
                            <input type="search" className="ps-12 pe-4 py-2.5 block w-64 bg-default-50 text-default-600 border-default-200 rounded-full text-sm ring-0 focus:border-primary focus:ring-primary" placeholder="Search for items..." />
                            <span className="absolute start-4 top-2.5">
                                <i data-lucide="search" className="w-5 h-5 text-default-600"></i>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ms-auto">
                        <div className="lg:flex hidden">
                            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button id="hs-dropdown-with-header" type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 h-10 w-10 rounded-full font-medium text-default-700 align-middle bg-default-100 hover:text-primary transition-all text-xs">
                                    <i data-lucide="globe" className="w-6 h-6"></i>
                                </button>

                                <div className="hs-dropdown-menu mt-2 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[12rem] shadow-md rounded-lg border border-default-200 bg-white dark:bg-default-50 p-2">
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 text-sm rounded transition-all hover:bg-default-100" href="#">
                                        <img src="/images/flags/germany.jpg" alt="user-image" className="h-4" />
                                        <span className="align-middle">German</span>
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 text-sm rounded transition-all hover:bg-default-100" href="#">
                                        <img src="/images/flags/italy.jpg" alt="user-image" className="h-4" />
                                        <span className="align-middle">Italian</span>
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 text-sm rounded transition-all hover:bg-default-100" href="#">
                                        <img src="/images/flags/spain.jpg" alt="user-image" className="h-4" />
                                        <span className="align-middle">Spanish</span>
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 text-sm rounded transition-all hover:bg-default-100" href="#">
                                        <img src="/images/flags/russia.jpg" alt="user-image" className="h-4" />
                                        <span className="align-middle">Russian</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="lg:flex hidden">
                            <button data-toggle="fullscreen" className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-10 w-10 rounded-full font-medium text-default-700 align-middle bg-default-100 hover:text-primary transition-all text-xs">
                                <i data-lucide="maximize" className="w-6 h-6"></i>
                            </button>
                        </div>

                        <div className="md:flex hidden">
                            <a href="/admin/settings" className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-10 w-10 rounded-full font-medium text-default-700 align-middle bg-default-100 hover:text-primary transition-all text-xs">
                                <i data-lucide="settings" className="w-6 h-6"></i>
                            </a>
                        </div>

                        <div className="md:flex hidden">
                            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button id="hs-dropdown-with-header" type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 h-10 w-10 rounded-full font-medium text-default-700 align-middle bg-default-100 hover:text-primary transition-all text-xs">
                                    <i data-lucide="bell" className="w-6 h-6"></i>
                                    <span className="absolute top-0 end-1 h-4 w-4 bg-yellow-500 rounded-full animate-ping"></span>
                                    <span className="absolute top-0 end-1 h-4 w-4 bg-yellow-500 text-xs font-medium text-white rounded-full">2</span>
                                </button>

                                <div className="hs-dropdown-menu mt-2 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[20rem] shadow-md rounded-lg border border-default-200 bg-white dark:bg-default-50">
                                    <div className="px-4 py-2 flex items-center justify-between">
                                        <h6 className="text-sm font-medium"> Notification</h6>
                                        <a href="javascript: void(0);" className="text-default-500">
                                            <small>Clear All</small>
                                        </a>
                                    </div>

                                    <div className="p-4 h-80 border-y border-dashed border-default-200" data-simplebar>
                                        <h5 className="text-xs text-default-700 mb-2">Today</h5>

                                        <a href="#" className="flex items-center mb-4">
                                            <img src="/images/avatars/avatar1.png" className="rounded-full h-10 w-10" />
                                            <div className="flex-grow truncate ms-2">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-medium text-default-800">Datacorp </h5>
                                                    <small className="inline-flex text-xs text-default-500">1 min ago</small>
                                                </div>
                                                <small className="text-default-400">Caleb Flakelar commented on Admin</small>
                                            </div>
                                        </a>

                                        <a href="#" className="flex items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <img src="/images/avatars/avatar2.png" className="rounded-full h-10 w-10" />
                                            </div>
                                            <div className="flex-grow truncate ms-2">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-medium text-default-800">Admin </h5>
                                                    <small className="inline-flex text-xs text-default-500">1 hr ago</small>
                                                </div>
                                                <small className="text-default-400">New user registered</small>
                                            </div>
                                        </a>

                                        <a href="#" className="flex items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <img src="/images/avatars/avatar3.png" className="rounded-full h-10 w-10" />
                                            </div>
                                            <div className="flex-grow truncate ms-2">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-medium text-default-800">Cristina Pride </h5>
                                                    <small className="inline-flex text-xs text-default-500">1 day ago</small>
                                                </div>
                                                <small className="text-default-400">Hi, How are you? What about our next meeting</small>
                                            </div>
                                        </a>

                                        <h5 className="text-xs text-default-700 mb-2">Yesterday</h5>

                                        <a href="#" className="flex items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <img src="/images/avatars/avatar4.png" className="rounded-full h-10 w-10" />
                                            </div>
                                            <div className="flex-grow truncate ms-2">
                                                <h5 className="text-sm font-semibold mb-1">Datacorp</h5>
                                                <small className="text-default-400">Caleb Flakelar commented on Admin</small>
                                            </div>
                                        </a>

                                        <a href="#" className="flex">
                                            <div className="flex-shrink-0">
                                                <img src="/images/avatars/avatar5.png" className="rounded-full h-10 w-10" />
                                            </div>
                                            <div className="flex-grow truncate ms-2">
                                                <h5 className="text-sm font-semibold mb-1">Karen Robinson</h5>
                                                <small className="text-default-400">Wow ! this admin looks good and awesome design</small>
                                            </div>
                                        </a>
                                    </div>

                                    <a href="#" className="px-4 py-2 block text-center text-primary font-medium text-sm">
                                        View All
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="hs-dropdown relative inline-flex ">
                                <button id="hs-dropdown-with-header" type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium text-default-700 align-middle transition-all text-xs">
                                    <img className="inline-block h-10 w-10 rounded-full" src="/images/avatars/avatar1.png" />
                                    <div className="lg:block text-start hidden">
                                        <p className="text-sm font-medium text-default-700">{user?.full_name}</p>
                                        <p className="text-xs text-default-500 mt-1">{user?.role}</p>
                                    </div>
                                </button>

                                <div className="hs-dropdown-menu mt-2 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[12rem] shadow-md rounded-lg p-2 border border-default-200 bg-white dark:bg-default-50">
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-default-800 transition-all hover:bg-default-100" href="/admin/settings">
                                        <i className="w-4 h-4" data-lucide="user"></i>
                                        My Profile
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-default-800 transition-all hover:bg-default-100" href="/home" target="_blank">
                                        <i className="w-4 h-4" data-lucide="newspaper"></i>
                                        Landing
                                    </a>
                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-default-800 transition-all hover:bg-default-100" href="/admin/settings">
                                        <i className="w-4 h-4" data-lucide="settings"></i>
                                        Setting
                                    </a>

                                    <hr className="my-2 border-default-200 -mx-2" />

                                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-red-400 hover:bg-red-400/10" href="#">
                                        <i className="w-4 h-4" data-lucide="log-out"></i>
                                        Log out
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}

