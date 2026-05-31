"use client";

import React from 'react'

export default function Footer() {
    return (
        <div>
            <footer className="border-t border-default-200">
                <div className="container">
                    <div className="grid lg:grid-cols-3 grid-cols-1 items-center gap-6 lg:py-10 py-6">
                        <div className="lg:col-span-2 col-span-1">
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">About</h5>
                                    <div className="text-default-600"><a href="#">About Us</a></div>
                                    <div className="text-default-600"><a href="#">Features</a></div>
                                    <div className="text-default-600"><a href="#">News</a></div>
                                    <div className="text-default-600"><a href="#">Careers</a></div>
                                    <div className="text-default-600"><a href="#">Services</a></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Company</h5>
                                    <div className="text-default-600"><a href="#">Our Team</a></div>
                                    <div className="text-default-600"><a href="#">Partner with Us</a></div>
                                    <div className="text-default-600"><a href="#">FAQs</a></div>
                                    <div className="text-default-600"><a href="#">Blog</a></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Support</h5>
                                    <div className="text-default-600"><a href="#">About</a></div>
                                    <div className="text-default-600"><a href="#">Support Center</a></div>
                                    <div className="text-default-600"><a href="#">Feedback</a></div>
                                    <div className="text-default-600"><a href="#">Contact Us</a></div>
                                    <div className="text-default-600"><a href="#">Accessibility</a></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Get in touch</h5>
                                    <div className="text-default-600"><a href="#">(+123) 456 789 123</a></div>
                                    <div className="text-default-600"><a href="#">example@mail.com</a></div>
                                    <div className="flex items-center gap-4">
                                        <a href="#!" className="cursor-pointer">
                                            <i data-lucide="phone" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </a>
                                        <a href="#!" className="cursor-pointer">
                                            <i data-lucide="globe" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </a>
                                        <a href="#!" className="cursor-pointer">
                                            <i data-lucide="instagram" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </a>
                                        <a href="#!" className="cursor-pointer">
                                            <i data-lucide="twitter" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex flex-col gap-3">
                                <div className="bg-primary/10 rounded-lg">
                                    <div className="p-8">
                                        <form className="space-y-2 mb-6">
                                            <label htmlFor="subscribeEmail" className="text-lg font-medium text-default-950 mb-4">Subscribe</label>
                                            <div className="flex rounded-md shadow-sm">
                                                <input type="email" id="subscribeEmail" name="subscribeEmail" className="py-3 px-4 block w-full bg-white border-default-200 rounded-s-md text-sm dark:bg-default-50" placeholder="Email address" />
                                                <button type="button" className="inline-flex flex-shrink-0 justify-center items-center h-[2.875rem] w-[2.875rem] rounded-e-md border border-transparent font-semibold bg-primary text-white hover:bg-primary-500 transition-all text-sm">
                                                    <i data-lucide="arrow-right" className="h-5 w-5"></i>
                                                </button>
                                            </div>
                                        </form>
                                        <p className="text-sm text-default-500 mb-6">A Res is a self-service shop offering a wide variety of food, beverages & household products we’re engage with their clients & their team.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 border-t border-default-200 lg:flex hidden">
                        <div className="container">
                            <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-6">
                                <div>
                                    <p className="text-default-600">
                                        {new Date().getFullYear()} Design crafted <i data-lucide="heart" className="inline h-4 w-4 text-red-500 fill-red-500"></i> by Coderthemes.com
                                    </p>
                                </div>

                                <div className="flex justify-end gap-6">
                                    <a href="#" className="text-default-500 font-medium">
                                        Terms
                                    </a>
                                    <a href="#" className="text-default-500 font-medium">
                                        Privacy
                                    </a>
                                    <a href="#" className="text-default-500 font-medium">
                                        Cookies
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

