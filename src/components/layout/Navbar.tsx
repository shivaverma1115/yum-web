"use client";

import React from 'react'

export default function Navbar() {
    return (
        <div>
            <div className="h-8 lg:flex items-center hidden bg-primary-950 text-white z-20">
                <div className="container">
                    <nav className="grid lg:grid-cols-3 items-center gap-4">
                        <div className="flex relative">
                            <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                <a className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base" href="#">
                                    <img alt="Image" className="h-3.5 me-3" src="/images/flags/us.jpg" />
                                    <span className="font-medium text-xs">English (USA)</span>
                                </a>

                                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[140px] transition-[opacity,margin] mt-4 opacity-0 hidden z-50 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                    <ul className="flex flex-col gap-1">
                                        <li>
                                            <a className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/us.jpg" />
                                                English</a>
                                        </li>
                                        <li>
                                            <a className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/french.jpg" /> French</a>
                                        </li>
                                        <li>
                                            <a className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/germany.jpg" />
                                                German</a>
                                        </li>
                                        <li>
                                            <a className="flex items-center gap-2 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="#"><img alt="flag" className="h-4" src="/images/flags/spain.jpg" /> Spanish</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h5 className="text-sm text-primary-50 text-center">Free Delivery Over $50 <a className="font-semibold underline" href="#">Claim Offer</a></h5>

                        <ul className="flex items-center justify-end gap-4">
                            <li className="flex menu-item">
                                <a className="text-sm hover:text-primary" href="/faqs">Help</a>
                            </li>

                            <li className="flex menu-item">
                                <a className="text-sm hover:text-primary" href="/contact">Contact Us</a>
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

                                <a href="/home">
                                    <img src="/images/logo-dark.png" alt="logo" className="h-10 flex dark:hidden" />
                                    <img src="/images/logo-light.png" alt="logo" className="h-10 hidden dark:flex" />
                                </a>
                            </div>

                            <ul className="menu lg:flex items-center justify-center hidden relative">
                                <li className="menu-item">
                                    <a className="inline-flex items-center text-sm lg:text-base font-medium text-default-800 py-2 px-4 rounded-full hover:text-primary " href="/home">Home </a>
                                </li>

                                <li className="menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                        <a className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">Product <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i></a>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-10 bg-white shadow-lg rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products">Product Grid</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products/list">Product List</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/products/classic-burger">Product Detail</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                <li className="menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--auto-close:inside]">
                                        <a className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm whitespace-nowrap lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">
                                            Mega Menu <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i>
                                        </a>

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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Bean Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Refried Bean and Cheese Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Falafel Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chickpea and Hummus Wrap</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Grilled Vegetable Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled Veggie Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Roasted Red Pepper Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Portobello Mushroom Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Eggplant Parmesan Wrap</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cheese and Spinach Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Spinach and Feta Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Paneer Tikka Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Caprese Wrap</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Chicken Wraps</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled Chicken Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Buffalo Chicken Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Caesar Wrap</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Shawarma Wrap</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Spaghetti Bolognese</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Fettuccine Alfredo</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lasagna</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carbonara</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Penne alla Vodka</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Asian Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Ramen</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pad Thai</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pho</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chow Mein</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Udon Stir-Fry</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Soba Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lo Mein</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Chinese Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Chow Fun</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Dan Dan Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sesame Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Wonton Noodle Soup</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Zha Jiang Mian</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Japanese Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Yakisoba</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tempura Udon</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Hiyashi Chukakies</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sushi Rolls</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Drunken Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tom Yum Noodle Soup</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Green Curry Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Glass Noodle Salad</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Indian Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Veg Hakka Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Maggi Noodles</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Masala Instant Noodles</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">Korean Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Japchae</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Jajangmyeon</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Ramyeon</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Naengmyeon</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Western Noodle Dishes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Noodle Soup</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Stroganoff</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tuna Noodle Casserole</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Macaroni and Cheese</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Street Tacos</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carnitas Tacos</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Barbacoa Tacos</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Fish Tacos</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Vegetarian Tacos</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Enchiladas</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Enchiladas</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheese Enchiladas</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Beef Enchiladas</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Suizas Enchiladas</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Tamales</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Pork Tamales</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Tamales</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sweet Tamales</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Quesadillas</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheese Quesadillas</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Quesadillas</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Vegetarian Quesadillas</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Grilled chicken breast with steamed broccoli and quinoa</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Baked salmon with asparagus and brown rice</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Low-Carb Meals</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cauliflower rice stir-fry with tofu and mixed vegetables</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Zucchini noodles with pesto and grilled shrimp</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                High-Protein Meals</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Lean beef or turkey burger with a side salad</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Greek yogurt parfait with berries and nuts</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheeseburger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Bacon Cheeseburger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Double Cheeseburger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Triple Cheeseburger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Classic Veggie Burger</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Patty Variations</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Turkey Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chicken Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Bison Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Salmon Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Bean Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Portobello Mushroom Burger</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Flavorful Toppings</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">BBQ Burgerges</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mushroom Swiss Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Western/Cowboy Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Blue Cheese Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Jalapeño Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Guacamole Burger</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Breakfast Burger</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Avocado Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Caprese Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mediterranean Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Tex-Mex Burger</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Reuben Burger</a>
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
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Espresso</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cappuccino</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Latte</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Americano</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Mocha</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Macchiato</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Tea</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Black Tea</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Green Tea</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Herbal Tea</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chai Tea</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Earl Grey</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cakes</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chocolate Cake</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Carrot Cake</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Red Velvet Cake</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Cheesecake</a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="ps-6">
                                                                            <h6 className="text-base font-medium text-default-800">
                                                                                Cookies & Pastries</h6>
                                                                            <ul className="grid space-y-3 mt-4">
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Chocolate Chip Cookies</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Oatmeal Raisin Cookies</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Peanut Butter Cookies</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Sugar Cookies</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Croissant</a>
                                                                                </li>
                                                                                <li>
                                                                                    <a className="text-sm font-medium text-default-600 hover:text-primary transition-all" href="#">Danish Pastry</a>
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
                                        <a className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="#">
                                            Pages <i className="w-4 h-4 ms-2" data-lucide="chevron-down"></i>
                                        </a>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-10 bg-white shadow-md rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/cart">Cart</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/wishlist">Wishlist</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/checkout">Checkout</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/faqs">FAQs</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/contact">Contact Us</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/404">Error 404</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/login">Login</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/register">Register</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/recover-password">Forgot Password</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/reset-password">Reset Password</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                <li className="menu-item">
                                    <a className="inline-flex items-center text-sm lg:text-base font-medium text-default-700 py-2 px-4 rounded-full hover:text-primary" href="/admin/dashboard" target="_blank">Admin</a>
                                </li>
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
                                    <a href="/cart" className="relative flex text-base transition-all text-default-600 hover:text-primary">
                                        <i className="w-5 h-5" data-lucide="shopping-bag"></i>
                                        <span className="absolute z-10 -top-2.5 end-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full">1</span>
                                    </a>
                                </li>

                                <li className="flex menu-item">
                                    <div className="hs-dropdown relative inline-flex [--trigger:hover] [--placement:bottom]">
                                        <a className="hs-dropdown-toggle after:absolute hover:after:-bottom-10 after:inset-0 relative flex items-center text-base transition-all text-default-600 hover:text-primary" href="#">
                                            <i className="w-5 h-5" data-lucide="user"></i>
                                        </a>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li>
                                                    <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/admin/dashboard" target="_blank"><i className="h-4 w-4" data-lucide="user-circle"></i> Admin</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/cart"><i className="h-4 w-4" data-lucide="shopping-cart"></i>
                                                        Cart</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/wishlist"><i className="h-4 w-4" data-lucide="heart"></i>
                                                        Wishlist</a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="/login"><i className="h-4 w-4" data-lucide="log-out"></i> Log Out</a>
                                                </li>
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
                    <a href="/home" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--house text-lg"></i>
                        <span className="text-xs font-medium">Home</span>
                    </a>
                    <a href="/products" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--utensils text-lg"></i>
                        <span className="text-xs font-medium">Food</span>
                    </a>
                    <a href="/wishlist" className="flex flex-col items-center justify-center gap-1 text-default-600" type="button">
                        <i className="iconify fa7-solid--heart text-lg"></i>
                        <span className="text-xs font-medium">Wishlist</span>
                    </a>
                </div>
            </div>

            <div id="mobile-menu" className="hs-overlay hs-overlay-open:translate-x-0 hidden -translate-x-full fixed top-0 left-0 transition-all transform h-full max-w-[270px] w-full z-60  border-r border-default-200 bg-white dark:bg-default-50" tabIndex={-1}>
                <div className="flex justify-center items-center border-b border-dashed border-default-200 h-16 transition-all duration-300">
                    <a href="/home">
                        <img src="/images/logo-dark.png" alt="logo" className="h-10 flex dark:hidden" />
                        <img src="/images/logo-light.png" alt="logo" className="h-10 hidden dark:flex" />
                    </a>
                </div>
                <div className="h-[calc(100%-4rem)]" data-simplebar>
                    <nav className="hs-accordion-group p-4 w-full flex flex-col flex-wrap">
                        <ul className="space-y-2.5">
                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/home">
                                    Home
                                </a>
                            </li>

                            <li className="hs-accordion" id="product-categories-accordion">
                                <a className="hs-accordion-toggle flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-primary hs-accordion-active:bg-default-100 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="#">
                                    Product <i data-lucide="chevron-down" className="w-5 h-5 ms-auto hs-accordion-active:rotate-180 transition-all"></i>
                                </a>

                                <div className="hs-accordion-content w-full overflow-hidden transition-[height] hidden">
                                    <ul className="pt-2 ps-2">
                                        <li>
                                            <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products">
                                                Product Grid
                                            </a>
                                        </li>
                                        <li>
                                            <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products/list">
                                                Product List
                                            </a>
                                        </li>
                                        <li>
                                            <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/products/classic-burger">
                                                Product Details
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/wishlist">
                                    My Wishlist
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/contact">
                                    Contact Us
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/faqs">
                                    FAQs
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/404">
                                    Error Page
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/login">
                                    Login
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/register">
                                    Register
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/recover-password">
                                    Forgot Password
                                </a>
                            </li>

                            <li>
                                <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm font-medium text-default-700 rounded-md hover:bg-default-100" href="/reset-password">
                                    Reset Password
                                </a>
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

