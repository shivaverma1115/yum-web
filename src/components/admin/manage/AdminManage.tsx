import Link from 'next/link'
import React from 'react'

export default function AdminManage() {
    return (
        <div className="grid lg:grid-cols-12 grid-cols-1 gap-6">
            <div className="lg:col-span-5 col-span-1">
                <div className="space-y-6">
                    <div className="border border-default-200 rounded-lg">
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-default-800 mb-4">Offer Zone</h3>
                            <div className="space-y-4">
                                <div className="bg-cyan-500/10 p-4 rounded-lg">
                                    <div className="flex items-center justify-center">
                                        <h4 className="shrink text-lg text-default-950 font-medium">Up to 50% OFF, Flat Discount and other <br className="hidden md:block" /> great offers</h4>
                                        <div className="grow flex justify-end">
                                            <img src="/images/icons/bag.svg" className="max-w-full h-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-pink-500/10 p-4 rounded-lg">
                                    <div className="flex items-center justify-center">
                                        <h4 className="shrink text-lg text-default-950 font-medium">Up to 50% OFF, Flat Discount and other <br className="hidden md:block" /> great offers</h4>
                                        <div className="grow flex justify-end">
                                            <img src="/images/icons/special-offer.svg" className="max-w-full h-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-default-200 rounded-lg overflow-hidden">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-default-800">Upcoming New Menu</h3>
                        </div>

                        <div className="h-[40rem] overflow-y-scroll custom-scroll">
                            <div className="space-y-4 px-6 pb-6">
                                <div className="bg-default-500/5 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <div className="shrink">
                                            <div className="h-28 w-28 bg-white rounded-lg overflow-hidden dark:bg-default-100">
                                                <img src="/images/dishes/red-velvet-pastry.png" className="max-w-full h-full" />
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h4 className="text-lg text-default-950 font-medium mb-2">Red Velvet Pastry</h4>
                                            <p className="text-sm text-default-600">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-default-500/5 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <div className="shrink">
                                            <div className="h-28 w-28 bg-white rounded-lg overflow-hidden dark:bg-default-100">
                                                <img src="/images/dishes/burrito-bowl.png" className="max-w-full h-full" />
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h4 className="text-lg text-default-950 font-medium mb-2">Burrito Bowl</h4>
                                            <p className="text-sm text-default-600">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-default-500/5 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <div className="shrink">
                                            <div className="h-28 w-28 bg-white rounded-lg overflow-hidden dark:bg-default-100">
                                                <img src="/images/dishes/burger.png" className="max-w-full h-full" />
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h4 className="text-lg text-default-950 font-medium mb-2">Burger</h4>
                                            <p className="text-sm text-default-600">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-default-500/5 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <div className="shrink">
                                            <div className="h-28 w-28 bg-white rounded-lg overflow-hidden dark:bg-default-100">
                                                <img src="/images/dishes/butter-cookies.png" className="max-w-full h-full" />
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h4 className="text-lg text-default-950 font-medium mb-2">Butter Cookies</h4>
                                            <p className="text-sm text-default-600">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-default-500/5 p-4 rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                                        <div className="shrink">
                                            <div className="h-28 w-28 bg-white rounded-lg overflow-hidden dark:bg-default-100">
                                                <img src="/images/dishes/hot-chocolate.png" className="max-w-full h-full" />
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h4 className="text-lg text-default-950 font-medium mb-2">Hot Chocolate</h4>
                                            <p className="text-sm text-default-600">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 col-span-1">
                <div className="border border-default-200 rounded-lg">
                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-default-800 mb-4">New Menu</h3>
                        <div className="space-y-4">
                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/veg.svg" />
                                    </div>
                                    <Link href="javascript:void(0)" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>

                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Veg Noodles</h5>
                                    <p className="text-base text-default-500 font-medium">$34.56</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/non-veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>

                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Chicken Pizza</h5>
                                    <p className="text-base text-default-500 font-medium">$18.63</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>

                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Burger</h5>
                                    <p className="text-base text-default-500 font-medium">$47.23</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/non-veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>

                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Mutton Biryani</h5>
                                    <p className="text-base text-default-500 font-medium">$34.56</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/non-veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>
                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Barbeque Chicken</h5>
                                    <p className="text-base text-default-500 font-medium">$24.53</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>
                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Chocolate</h5>
                                    <p className="text-base text-default-500 font-medium">$34.56</p>
                                </div>
                            </div>

                            <div className="bg-default-500/5 p-4 rounded-lg">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="h-6 w-6">
                                        <img src="/images/icons/veg.svg" />
                                    </div>
                                    <Link href="/products" className="inline-flex items-center justify-center group gap-2 border border-primary text-primary text-sm font-medium rounded-full py-1.5 px-3 transition-all duration-300 hover:bg-primary hover:text-white"><i data-lucide="pencil" className="h-4 w-4 text-primary fill-primary group-hover:text-white group-hover:fill-white"></i> Edit</Link>
                                </div>
                                <div className="flex items-center justify-between gap-6">
                                    <h5 className="text-lg text-default-900 font-semibold">Noodles Bowl</h5>
                                    <p className="text-base text-default-500 font-medium">$47.23</p>
                                </div>
                            </div>

                            <div className="text-end">
                                <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-4 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Add Menu items</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3">
                <div className="space-y-4">
                    <div className="border border-default-200 rounded-lg">
                        <div className="p-4">
                            <h5 className="text-lg text-default-900 font-semibold mb-6">New Order</h5>

                            <div className="flex items-center justify-center gap-4">
                                <div className="w-1/4">
                                    <div id="new_order" data-colors="#009400"></div>
                                </div>

                                <div className="w-4/5">
                                    <p className="text-sm text-default-500 font-medium">34% Payment</p>
                                    <h3 className="text-lg text-default-950 font-medium">Increase Order</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-default-200 rounded-lg">
                        <div className="p-4">
                            <h5 className="text-lg text-default-900 font-semibold mb-6">Cancelled Order</h5>

                            <div className="flex items-center justify-center gap-4">
                                <div className="w-1/4">
                                    <div id="cancelled_order" data-colors="#D40000"></div>
                                </div>

                                <div className="w-4/5">
                                    <p className="text-sm text-default-500 font-medium">45% Payment</p>
                                    <h3 className="text-lg text-default-950 font-medium">Decrease Order</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-default-200 rounded-lg">
                        <div className="p-4 text-center">
                            <div className="h-16 w-16 mx-auto mb-6">
                                <img src="/images/icons/combo.svg" className="max-w-full h-full" />
                            </div>
                            <h4 className="text-xl text-default-950 font-semibold mb-6">Find best food in <br /> your town</h4>
                            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-4 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Add Location</Link>
                        </div>
                    </div>

                    <div className="rounded-lg bg-primary/10 bg-no-repeat bg-cover" style={{ backgroundImage: "url('/images/other/offer-bg3.png')" }}>
                        <div className="p-4 text-center">
                            <div className="flex items-center justify-center mb-10">
                                <div className="w-1/2">
                                    <h4 className="text-xl text-primary font-semibold -rotate-12">Today’s <br /> Special <br /> Menu</h4>
                                </div>

                                <div className="w-1/2">
                                    <span className="inline-flex items-center justify-center text-xl text-default-900 font-medium h-20 w-20 border-2 border-orange-400 rounded-full">
                                        50% <br /> OFF
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center mb-6">
                                <img src="/images/other/filter-offer-dish-2.png" className="w-60 h-full rounded-lg" />
                            </div>
                            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-3 text-center text-base font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Order Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

