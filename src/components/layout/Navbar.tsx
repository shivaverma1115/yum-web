"use client";

import Link from 'next/link';
import React from 'react';
import { useCart } from "@/context-api/cart-context";
import { useContextApi } from "@/context-api/use-context";
import { useLogout } from "@/lib/auth/useLogout";
import { UserRole } from "@/types/user";
import { getUserDisplayName } from "@/lib/user/display-name";

export default function Navbar() {
    const handleLogout = useLogout();
    const { user, isAuthenticated } = useContextApi();
    const { itemCount } = useCart();
    const isAdmin = user?.role === UserRole.ADMIN;

    return (
        <div>
            <div className="h-8 lg:flex items-center hidden bg-primary-950 text-white z-20">
                <div className="container">
                    <nav className="grid lg:grid-cols-3 items-center gap-4">
                        <div className="flex relative">
                            <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base" href="#">
                                    <img alt="Image" className="h-3.5 me-3" src="/images/flags/us.jpg" />
                                    <span className="font-medium text-xs">English (USA)</span>
                                </Link>

                                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[140px] transition-[opacity,margin] mt-4 opacity-0 hidden z-50 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                    <ul className="flex flex-col gap-1">
                                        <li>
                                            <Link className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/us.jpg" />
                                                English</Link>
                                        </li>
                                        <li>
                                            <Link className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/french.jpg" /> French</Link>
                                        </li>
                                        <li>
                                            <Link className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/germany.jpg" />
                                                German</Link>
                                        </li>
                                        <li>
                                            <Link className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/spain.jpg" /> Spanish</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h5 className="text-sm text-primary-50 text-center">Free Delivery Over $50 <Link className="font-semibold underline" href="#">Claim Offer</Link></h5>

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
                                <button className="lg:hidden block " data-hs-overlay="#mobile-menu">
                                    <i data-lucide="menu" className="w-7 h-7 text-default-600 me-4 hover:text-primary"></i>
                                </button>

                                <Link href="/home">
                                    <img src="/images/logo-dark.png" alt="logo" className="h-10 flex dark:hidden" />
                                    <img src="/images/logo-light.png" alt="logo" className="h-10 hidden dark:flex" />
                                </Link>
                            </div>

                            <ul className="menu lg:flex items-center justify-center hidden relative">
                                <li className="menu-item">
                                    <Link className="inline-flex items-center text-sm lg:text-base font-medium text-default-800 py-2 px-4 rounded-full hover:text-primary " href="/home">Home </Link>
                                </li>

                                <li className="menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                        <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">Product <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i></Link>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-10 bg-white shadow-lg rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products">Product Grid</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products/list">Product List</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products/classic-burger">Product Detail</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                <li className="menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--auto-close:inside]">
                                        <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm whitespace-nowrap lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">
                                            Mega Menu <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i>
                                        </Link>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 top-full inset-x-0 w-full min-w-full absolute mt-4 transition-[opacity,margin] opacity-0 hidden z-10 duration-300">
                                            <div className="container">
                                                <div className="bg-white shadow-lg rounded-lg border border-default-200 overflow-hidden dark:bg-default-50">
                                                    <div className="grid grid-cols-12">
                                                        <div className="col-span-2 text-sm">
                                                            <div className="bg-default-100 h-full w-full py-10 px-6">
                                                                <nav aria-label="Tabs" className="flex flex-col space-y-3.5" data-hs-tabs-vertical="true" role="tablist">
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all active" data-hs-tab="#wraps" role="tab" type="button">
                                                                        Wraps <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#noodles" role="tab" type="button">
                                                                        Noodles <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#mexican" role="tab" type="button">
                                                                        Mexican cuisine <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#tacos" role="tab" type="button">
                                                                        Tacos <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#smart-meals" role="tab" type="button">
                                                                        Smart Meals <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#burger" role="tab" type="button">
                                                                        Burger <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                    <button className="hs-tab-active:text-primary !bg-transparent inline-flex items-center text-base font-medium text-default-600 hover:text-primary transition-all" data-hs-tab="#beverages-desserts" role="tab" type="button">
                                                                        Beverages & Desserts <i className="w-5 h-5 ms-auto" data-lucide="chevron-right"></i>
                                                                    </button>
                                                                </nav>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-10">
                                                            <div className="py-10">
                                                                <div id="wraps" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Bean-Based Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Bean Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Refried Bean and Cheese Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Falafel Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chickpea and Hummus Wrap</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Grilled Vegetable Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled Veggie Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Roasted Red Pepper Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Portobello Mushroom Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Eggplant Parmesan Wrap</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cheese and Spinach Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Spinach and Feta Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Paneer Tikka Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Caprese Wrap</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Chicken Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled Chicken Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Buffalo Chicken Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Caesar Wrap</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Shawarma Wrap</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="hidden" id="noodles" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Italian Pasta Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Spaghetti Bolognese</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Fettuccine Alfredo</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lasagna</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carbonara</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Penne alla Vodka</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Asian Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Ramen</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pad Thai</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pho</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chow Mein</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Udon Stir-Fry</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Soba Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lo Mein</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Chinese Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Chow Fun</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Dan Dan Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sesame Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Wonton Noodle Soup</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Zha Jiang Mian</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Japanese Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Yakisoba</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tempura Udon</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Hiyashi Chukakies</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sushi Rolls</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="hidden" id="mexican" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Thai Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Drunken Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tom Yum Noodle Soup</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Green Curry Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Glass Noodle Salad</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Indian Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Veg Hakka Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Maggi Noodles</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Masala Instant Noodles</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Korean Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Japchae</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Jajangmyeon</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Ramyeon</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Naengmyeon</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Western Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Noodle Soup</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Stroganoff</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tuna Noodle Casserole</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Macaroni and Cheese</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="hidden" id="tacos" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Tacos</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Street Tacos</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carnitas Tacos</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Barbacoa Tacos</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Fish Tacos</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Vegetarian Tacos</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Enchiladas</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Enchiladas</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheese Enchiladas</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Enchiladas</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Suizas Enchiladas</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Tamales</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pork Tamales</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Tamales</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sweet Tamales</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Quesadillas</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheese Quesadillas</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Quesadillas</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Vegetarian Quesadillas</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="hidden" id="smart-meals" role="tabpanel">
                                                                    <div className="grid grid-cols-3 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Balanced Meals</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled chicken breast with steamed broccoli and quinoa</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Baked salmon with asparagus and brown rice</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Low-Carb Meals</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cauliflower rice stir-fry with tofu and mixed vegetables</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Zucchini noodles with pesto and grilled shrimp</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                High-Protein Meals</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lean beef or turkey burger with a side salad</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Greek yogurt parfait with berries and nuts</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="hidden" id="burger" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Classic Burgers</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheeseburger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Bacon Cheeseburger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Double Cheeseburger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Triple Cheeseburger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Classic Veggie Burger</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Patty Variations</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Turkey Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Bison Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Salmon Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Bean Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Portobello Mushroom Burger</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Flavorful Toppings</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">BBQ Burgerges</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mushroom Swiss Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Western/Cowboy Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Blue Cheese Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Jalapeño Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Guacamole Burger</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Breakfast Burger</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Avocado Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Caprese Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mediterranean Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tex-Mex Burger</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Reuben Burger</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                <div className="hidden" id="beverages-desserts" role="tabpanel">
                                                                    <div className="grid grid-cols-4 divide-x divide-default-200">
                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Coffee Based</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Espresso</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cappuccino</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Latte</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Americano</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mocha</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Macchiato</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Tea</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Tea</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Green Tea</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Herbal Tea</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chai Tea</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Earl Grey</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cakes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chocolate Cake</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carrot Cake</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Red Velvet Cake</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheesecake</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cookies & Pastries</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chocolate Chip Cookies</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Oatmeal Raisin Cookies</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Peanut Butter Cookies</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sugar Cookies</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Croissant</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Danish Pastry</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                <li className="menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                        <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">
                                            Pages <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i>
                                        </Link>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-10 bg-white shadow-md rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/cart">Cart</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/wishlist">Wishlist</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/checkout">Checkout</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/faqs">FAQs</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/contact">Contact Us</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/404">Error 404</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/login">Login</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/register">Register</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/recover-password">Forgot Password</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/reset-password">Reset Password</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                {isAdmin ? (
                                    <li className="menu-item">
                                        <Link className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="/admin/dashboard">Admin</Link>
                                    </li>
                                ) : null}
                                {isAuthenticated ? (
                                    <li className="menu-item">
                                        <button
                                            type="button"
                                            className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li className="menu-item">
                                        <Link className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="/login">Login</Link>
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

                                <li className="2xl:hidden flex menu-item">
                                    <button data-hs-overlay="#mobileSearchSidebar" className="relative flex text-base transition-all text-default-600 hover:text-primary">
                                        <i className="w-5 h-5" data-lucide="search"></i>
                                    </button>
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
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                        <Link className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base transition-all text-default-600 hover:text-primary" href="#">
                                            <i className="w-5 h-5" data-lucide="user"></i>
                                        </Link>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                {user ? (
                                                    <li className="px-3 py-2 text-sm font-medium text-default-800">
                                                        {getUserDisplayName(user)}
                                                    </li>
                                                ) : null}
                                                {isAdmin ? (
                                                    <li>
                                                        <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/admin/dashboard"><i className="h-4 w-4" data-lucide="user-circle"></i> Admin</Link>
                                                    </li>
                                                ) : null}
                                                <li>
                                                    <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/cart"><i className="h-4 w-4" data-lucide="shopping-cart"></i>
                                                        Cart</Link>
                                                </li>
                                                <li>
                                                    <Link className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/wishlist"><i className="h-4 w-4" data-lucide="heart"></i>
                                                        Wishlist</Link>
                                                </li>
                                                {isAuthenticated ? (
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
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex lg:hidden">
                <div className="fixed inset-x-0 bottom-0 h-16 w-full grid grid-cols-3 items-center justify-items-center border-t border-default-200 bg-white dark:bg-default-50 z-40">
                    <Link href="/home" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--house text-lg"></i>
                        <span className="text-xs font-medium">Home</span>
                    </Link>
                    <Link href="/products" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--utensils text-lg"></i>
                        <span className="text-xs font-medium">Food</span>
                    </Link>
                    <Link href="/wishlist" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--heart text-lg"></i>
                        <span className="text-xs font-medium">Wishlist</span>
                    </Link>
                </div>
            </div>

            <div id="mobile-menu" className="hs-overlay hs-overlay-open:translate-x-0 hidden -translate-x-full fixed top-0 left-0 transition-all transform h-full max-w-[270px] w-full z-60  border-r border-default-200 bg-white dark:bg-default-50" tabIndex={-1}>
                <div className="flex justify-center items-center border-b border-dashed border-default-200 h-16 transition-all duration-300">
                    <Link href="/home">
                        <img src="/images/logo-dark.png" alt="logo" className="h-10 flex dark:hidden" />
                        <img src="/images/logo-light.png" alt="logo" className="h-10 hidden dark:flex" />
                    </Link>
                </div>
                <div className="h-[calc(100%-4rem)]" data-simplebar>
                    <nav className="hs-accordion-group p-4 w-full flex flex-col flex-wrap">
                        <ul className="space-y-2.5">
                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/home">
                                    Home
                                </Link>
                            </li>

                            <li className="hs-accordion" id="product-categories-accordion">
                                <Link className="hs-accordion-toggle flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-primary hs-accordion-active:bg-default-100 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="#">
                                    Product <i data-lucide="chevron-down" className="w-5 h-5 ms-auto hs-accordion-active:rotate-180 transition-all"></i>
                                </Link>

                                <div className="hs-accordion-content w-full overflow-hidden transition-[height] hidden">
                                    <ul className="pt-2 ps-2">
                                        <li>
                                            <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products">
                                                Product Grid
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products/list">
                                                Product List
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products/classic-burger">
                                                Product Details
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/wishlist">
                                    My Wishlist
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/contact">
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/faqs">
                                    FAQs
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/404">
                                    Error Page
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/login">
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/register">
                                    Register
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/recover-password">
                                    Forgot Password
                                </Link>
                            </li>

                            <li>
                                <Link className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/reset-password">
                                    Reset Password
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div id="mobileSearchSidebar" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-60 overflow-x-hidden overflow-y-auto">
                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                    <div className="flex flex-col bg-white shadow-sm rounded-lg">
                        <div className="relative flex w-full">
                            <span className="absolute start-4 top-3">
                                <i className="w-4 h-4 text-primary-500" data-lucide="search"></i>
                            </span>

                            <input className="px-10 py-2.5 block w-full border-transparent placeholder-primary-500 rounded-lg text-sm bg-transparent text-primary-500" placeholder="Search for items..." type="search" />

                            <button className="absolute end-4 top-3" data-hs-overlay="#mobileSearchSidebar">
                                <i className="w-4 h-4 text-primary-500" data-lucide="x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

