"use client";

import { useBusinessSettings } from '@/context-api/business-settings-context';
import Link from 'next/link';
import React from 'react'

export default function Footer() {
    const { settings: businessSettings } = useBusinessSettings();
    return (
        <div>
            <footer className="border-t border-default-200">
                <div className="container">
                    <div className="grid lg:grid-cols-3 grid-cols-1 items-center gap-6 lg:py-10 py-6">
                        <div className="lg:col-span-2 col-span-1">
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">About</h5>
                                    <div className="text-default-600"><Link href="#">About Us</Link></div>
                                    <div className="text-default-600"><Link href="#">Features</Link></div>
                                    <div className="text-default-600"><Link href="#">News</Link></div>
                                    <div className="text-default-600"><Link href="#">Careers</Link></div>
                                    <div className="text-default-600"><Link href="#">Services</Link></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Company</h5>
                                    <div className="text-default-600"><Link href="#">Our Team</Link></div>
                                    <div className="text-default-600"><Link href="#">Partner with Us</Link></div>
                                    <div className="text-default-600"><Link href="#">FAQs</Link></div>
                                    <div className="text-default-600"><Link href="#">Blog</Link></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Support</h5>
                                    <div className="text-default-600"><Link href="#">About</Link></div>
                                    <div className="text-default-600"><Link href="#">Support Center</Link></div>
                                    <div className="text-default-600"><Link href="#">Feedback</Link></div>
                                    <div className="text-default-600"><Link href="#">Contact Us</Link></div>
                                    <div className="text-default-600"><Link href="#">Accessibility</Link></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="mb-3 font-semibold text-default-950">Get in touch</h5>
                                    <div className="text-default-600"><Link href={`tel:${businessSettings.support.phone}`}>{businessSettings.support.phone}</Link></div>
                                    <div className="text-default-600"><Link href={`mailto:${businessSettings.support.email}`}>{businessSettings.support.email}</Link></div>
                                    <div className="flex items-center gap-4">
                                        <Link href={`tel:${businessSettings.support.phone}`} className="cursor-pointer">
                                            <i data-lucide="phone" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </Link>
                                        <Link href={`${businessSettings.general.site_url}`} className="cursor-pointer">
                                            <i data-lucide="globe" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </Link>
                                        {businessSettings.social.instagram ? (
                                        <Link href={`https://www.instagram.com/${businessSettings.social.instagram}`} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                                            <i data-lucide="instagram" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </Link>
                                        ) : null}
                                        {businessSettings.social.twitter ? (
                                        <Link href={`https://www.twitter.com/${businessSettings.social.twitter}`} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                                            <i data-lucide="twitter" className="h-6 w-6 transition-all text-default-600 hover:text-primary"></i>
                                        </Link>
                                        ) : null}
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
                                    <Link href="#" className="text-default-500 font-medium">
                                        Terms
                                    </Link>
                                    <Link href="#" className="text-default-500 font-medium">
                                        Privacy
                                    </Link>
                                    <Link href="#" className="text-default-500 font-medium">
                                        Cookies
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

