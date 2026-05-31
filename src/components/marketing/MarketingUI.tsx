import { Eye } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function MarketingUI() {
    return (
        <div>
            <header className="sticky top-0 inset-x-0 items-center z-40 w-full bg-transparent transition-all duration-300 backdrop-blur" id="navbar">
                <div className="h-16 flex items-center">
                    <div className="container">
                        <nav className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <a href="/">
                                    <img src="/images/logo-dark.png" alt="logo" className="h-10 flex dark:hidden" />
                                    <img src="/images/logo-light.png" alt="logo" className="h-10 hidden dark:flex" />
                                </a>
                            </div>

                            <div className="flex-grow hidden lg:block mx-auto relative">
                                <ul className="menu flex items-center justify-center">

                                    <li className="menu-item">
                                        <div className="flex items-center">
                                            <a className="inline-flex items-center text-sm lg:text-base font-medium text-primary-500/75 py-2 px-4 rounded-full hover:text-primary-600" href="#home">Home</a>
                                        </div>
                                    </li>

                                    <li className="menu-item">
                                        <div className="flex items-center">
                                            <a className="inline-flex items-center text-sm lg:text-base font-medium  text-primary-500/75 py-2 px-4 rounded-full hover:text-primary-600" href="#demo">Demos</a>
                                        </div>
                                    </li>

                                    <li className="menu-item">
                                        <div className="flex items-center">
                                            <a className="inline-flex items-center text-sm lg:text-base font-medium  text-primary-500/75 py-2 px-4 rounded-full hover:text-primary-600" href="#features">Features</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <a href="#demo" className="inline-flex items-center gap-2.5 text-white focus:outline-none font-semibold rounded text-sm px-4 py-2 text-center md:me-0  shadow-lg shadow-transparent transition-all duration-500 ease-in-out hover:-translate-y-[2px] bg-primary">
                                    <i className="h-5 w-5" data-lucide="shopping-cart"></i> Order Now
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <section className="lg:pt-24 lg:pb-36 py-6 relative bg-gradient-to-t from-orange-600/20 via-orange-600/5 to-orange-600/0" id="home">
                <div className="absolute inset-0 "></div>
                <div className="container relative">
                    <div className="grid lg:grid-cols-10 gap-12">
                        <div className=" z-10 self-center lg:col-span-4">
                            <div className="text-center lg:text-start">
                                <h1 className="lg:text-4xl/normal md:text-3xl/snug text-2xl font-medium capitalize  text-primary-950 dark:text-primary-50">
                                    Multipurpose <span className="text-primary font-semibold">Food</span> Client & Admin App with Tailwind
                                </h1>

                                <p className="mt-5">Discover the ease of having your preferred dishes delivered straight to your door.</p>

                                <Link
                                    href="/home"
                                    className="w-auto inline-flex items-center font-semibold gap-2 px-6 py-2.5 rounded-full transition-all duration-300 text-white bg-primary hover:shadow-primary-200/10 hover:shadow-xl mt-10"
                                >
                                    View Demos <Eye className="h-5 w-5 shrink-0" aria-hidden />
                                </Link>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center lg:col-start-6 lg:col-end-11">
                            <img src="/images/demo/1.png" className="mx-auto shadow-lg rounded-lg" />
                        </div>


                    </div>
                    <div className="text-center mt-20">
                        <p className="text-2xl font-medium">Developed Using</p>
                        <div className="inline-flex flex-wrap items-center justify-center gap-4 mt-8">
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/tailwindcss.svg" className="w-9 h-9" />
                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/html.svg" className="w-9 h-9" />
                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/css.svg" className="w-9 h-9" />
                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/javascript.svg" className="w-9 h-9" />
                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/vitejs-logo.svg" className="w-9 h-9" />
                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white dark:bg-default-200">
                                <img src="/images/demo/logo/bun.svg" className="w-9 h-9" />
                            </div>

                            {/* <!-- <div className="w-16 h-16 flex justify-center items-center rounded-full bg-white shadow-lg border border-default-100 dark:bg-default-100">-->
                                <!-- <img src="/images/demo/logo/figma.svg" className="w-9 h-9" />-->
                                <!--</div>--> */}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20" id="demo">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100  mb-2">Apps</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Client & Admin Apps</h2>
                        <p className="text-base font-medium text-default-900">
                            Empowering Food Business: Seamless Control for Clients, Effortless Management for Admins!
                        </p>
                    </div>


                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 justify-content-center" data-aos="fade-up" data-aos-duration="1000">
                        <Link href="/home" target="_blank">
                            <div className="relative group  rounded-lg text-center transition-all duration-500 shadow border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-5">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/1.png" />
                                        <div className="absolute flex items-center justify-center h-full w-full bg-default-500/20 inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-5 text-xl font-semibold text-primary text-center capitalize">Client Web</h5>
                                </div>
                            </div>
                        </Link>

                        <a href="admin/dashboard" target="_blank">
                            <div className="relative group  rounded-lg text-center transition-all duration-500 shadow border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-5">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/admin.png" />
                                        <div className="absolute flex items-center justify-center h-full w-full bg-default-500/20 inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-5 text-xl font-semibold text-primary text-center capitalize">Admin Panel</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100 mb-2">User</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Client App</h2>
                        <p className="text-base font-medium text-default-900">
                            Instant Flavor, Effortless Ordering: Your Culinary Journey Starts Here with Our Food Client Web App!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 justify-content-center" data-aos="fade-up" data-aos-duration="1000">
                        <a className="" href="products" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/2.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product Grid</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="products/list" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/3.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product List</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="products/[slug]" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/4.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product
                                        Details</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="cart" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/5.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Cart</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="checkout" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded-lg overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded-lg border border-default-100" src="/images/demo/7.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Checkout</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="wishlist" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/6.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Wishlist</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-20" id="admin">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100  mb-2">Control</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Admin Panel</h2>
                        <p className="text-base font-medium text-default-900">
                            Effortless Kitchen Management: Elevate Your Culinary Business with Our Admin Web App!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 justify-content-center" data-aos="fade-up" data-aos-duration="1000">

                        <a className="" href="admin/wallet" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/1.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Wallet</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/manage" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/19.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Manage</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/restaurants" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/13.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Restaurants List</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin-restaurants-details.html" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/12.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Restaurants Details</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin-customers-details.html" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/16.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Customers Details </h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin-products/list" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/9.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product List</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100  mb-2">Security</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Auth Pages</h2>
                        <p className="text-base font-medium text-default-900">
                            Well, of course we would provide Authentication pages, which are just right for your App.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 justify-content-center" data-aos="fade-up" data-aos-duration="1000">

                        <a className="" href="login" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/login.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Login</h5>
                                </div>
                            </div>
                        </a>
                        <a className="" href="register" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/register.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Register</h5>
                                </div>
                            </div>
                        </a>
                        <a className="" href="recover-password" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/forgotpassword.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Forgot
                                        Password</h5>
                                </div>
                            </div>
                        </a>
                        <div className="lg:col-span-3">
                            <div className="flex justify-center">
                                <div className="lg:w-1/3">
                                    <a className="" href="reset-password" target="_blank">
                                        <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                            <div className="p-4">
                                                <div className="relative rounded overflow-hidden ">
                                                    <img alt="demo-img" className="w-full rounded" src="/images/demo/resetpassword.png" />
                                                    <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                                        <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                            Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                                    </div>
                                                </div>
                                                <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Reset
                                                    Password</h5>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100  mb-2">Helper</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Extra Pages</h2>
                        <p className="text-base font-medium text-default-900">
                            Beyond Taste: Explore Food Varieties with our Extra Pages Web App – Where Culinary Diversity Meets Innovation!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 justify-content-center" data-aos="fade-up" data-aos-duration="1000">


                        <a className="" href="faqs" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/8.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">FAQs</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="*" target="_blank">
                            <div className="relative group  rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4 ">
                                    <div className="relative rounded">
                                        <img alt="demo-img" className="w-full rounded  transition-all" src="/images/demo/10.png" />
                                        <div className="absolute rounded inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Error 404</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="contact" target="_blank">
                            <div className="relative group  rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/9.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Contact Us</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/products/details" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/8.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product details</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/products/add" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/7.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product Add</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/products/1/edit" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/6.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Product Edit</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/customers" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/17.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Customers List</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/customers/add" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/15.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Customers Add</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/customers/1/edit" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/14.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Customers Edit</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/sellers" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/5.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Seller List</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/sellers/1" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/4.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Seller Details</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/sellers/add" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/3.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Seller Add</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/sellers/1/edit" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/2.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Seller Edit</h5>
                                </div>
                            </div>
                        </a>

                        <a className="" href="admin/settings" target="_blank">
                            <div className="relative group rounded-lg text-center transition-all duration-500 shadow-md border border-default-100 bg-white hover:-translate-y-1 dark:bg-default-100">
                                <div className="p-4">
                                    <div className="relative rounded overflow-hidden ">
                                        <img alt="demo-img" className="w-full rounded" src="/images/demo/admin/21.png" />
                                        <div className="absolute inset-0 flex items-center justify-center h-full w-full bg-default-500/20  opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                                            <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                                                Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><i className="h-5 w-5" data-lucide="external-link"></i></span></div>
                                        </div>
                                    </div>
                                    <h5 className="mt-4 text-lg font-semibold text-primary text-center capitalize">Settings</h5>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-default-50/80" id="features">
                <div className="container">
                    <div className=" mx-auto text-center mb-14">
                        <span className="inline-flex text-base border-x-2 border-x-primary-600 text-primary-700 font-semibold px-2 rounded-full bg-primary-100  mb-2">Features</span>
                        <h2 className="text-3xl font-semibold text-default-950 mb-2.5">Awesome Template Features</h2>
                    </div>

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="airplay"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Ultra Responsive</h4>
                                        <p className="text-sm font-medium text-default-600">Our fully Responsive design ensures your
                                            content is beautifully presented no matter what device your audience is using.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="package"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Production Ready</h4>
                                        <p className="text-sm font-medium text-default-600">Our solutions have undergone extensive testing
                                            to ensure they can handle the demands of a production environment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="figma"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Hygienic Design</h4>
                                        <p className="text-sm font-medium text-default-600">Our designs feature smooth and continuous
                                            surfaces, minimizing areas where dirt, bacteria, or contaminants can accumulate.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="circuit-board"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">High Performance</h4>
                                        <p className="text-sm font-medium text-default-600">We understand that your requirements are
                                            unique. Our high-performance solutions are customizable to match your specific
                                            goals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="globe-2"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Multi Browser Support</h4>
                                        <p className="text-sm font-medium text-default-600">Our e-commerce store is rigorously tested and
                                            optimized to work flawlessly on all major web browsers, offering a consistent shopping
                                            experience to all our customers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="file-text"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Well Documented</h4>
                                        <p className="text-sm font-medium text-default-600">Our documentation is a treasure trove of
                                            valuable information, from getting started guides to advanced tutorials. It's all there
                                            to help you make the most of our services.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="users-2"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Great Support</h4>
                                        <p className="text-sm font-medium text-default-600">Our support team is always ready to help.
                                            Whether you have questions, encounter issues, or need guidance, we're just a message or
                                            call away.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="move"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Highly Customizable</h4>
                                        <p className="text-sm font-medium text-default-600">Our product is designed to adapt to your
                                            specific requirements. Whether you're an individual, a business, or an organization, we
                                            provide the tools to customize it to your liking.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="feather"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">Light as a Feather</h4>
                                        <p className="text-sm font-medium text-default-600">From our years of experience and expertise in Development, we know users vary, they could have slow of fast network.
                                            They all deserve seamless experience in shopping with you.
                                            That's why our product is developed with fewer lines.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-default-50 rounded-xl border border-default-200 hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex flex-col justify-center items-center text-center gap-4">
                                    <div className="shrink">
                                        <div className="inline-flex items-center justify-center h-12 w-12 bg-primary-100 text-primary-600 rounded-md">
                                            <i className="h-6 w-6" data-lucide="star"></i>
                                        </div>
                                    </div>
                                    <div className="grow">
                                        <h4 className="text-lg font-semibold text-default-950 mb-2">UX Considered</h4>
                                        <p className="text-sm font-medium text-default-600">A good design does not need any explanation because a good design can speak for itself. Out app doesn't only have a good User Interface, we also have considered User experience.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-base text-center mt-6 font-medium text-primary">All these sounds yummy, right? Wait until you purchase it. 😉</p>
                </div>
            </section>

            <footer className="relative bg-primary/5 bg-cover bg-no-repeat bg-center">
                <div className="pt-20 pb-10" data-aos="fade-up" data-aos-duration="1000">
                    <div className="container relative">
                        <div className="text-center">
                            <div className=" mx-auto mb-12">
                                <a className="flex items-center justify-center" href="#">
                                    <img className="h-10" src="/images/logo-dark.png" />
                                </a>
                                <h2 className="md:text-3xl text-xl font-semibold text-default-900 capitalize my-5">Get Food for yourself</h2>
                                <p className="font-semibold text-default-800">Start working with <span className="text-primary">Food</span>
                                    to showcase your app to millions of people.</p>
                            </div>

                            <a className="inline-flex items-center gap-2.5 text-white focus:outline-none font-semibold rounded text-sm px-4 py-2 text-center md:me-0  shadow-lg shadow-transparent transition-all duration-500 ease-in-out hover:-translate-y-[2px] bg-primary" href="#"><i className="h-5 w-5" data-lucide="shopping-cart"></i> Buy Now</a>
                        </div>
                    </div>
                </div>

                <div className="container relative">
                    <p className="py-6 text-center font-medium text-default-900">
                        {new Date().getFullYear().toString()}
                        © Yum.
                        Crafted and Coded with <span className="text-red-500">❤️</span> by <a className="text-primary-700" href="https://coderthemes.com/" target="_blank">Coderthemes</a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

