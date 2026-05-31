import React from 'react'

export default function AdminProductDetailsPage() {
    return (
        <div>
            <div className="w-full lg:ps-64">
                <div className="p-6 page-content">

                    {/* {{> admin - page - title subtitle="Products" title="Products Detail"}} */}

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-lg border-default-200">
                            <div className="grid grid-cols-1">
                                <div>
                                    <div className="swiper cart-swiper">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <img src="/images/dishes/burrito-bowl.png" className="max-w-full h-full mx-auto" />
                                            </div>

                                            <div className="swiper-slide">
                                                <img src="/images/dishes/burrito-bowl-2.png" className="max-w-full h-full mx-auto" />
                                            </div>

                                            <div className="swiper-slide">
                                                <img src="/images/dishes/burrito-bowl-3.png" className="max-w-full h-full mx-auto" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="swiper cart-swiper-pagination justify-center">
                                    <div className="swiper-wrapper justify-center gap-4 w-full">
                                        <div className="swiper-slide cursor-pointer !w-20 !h-20 lg:!w-32 lg:!h-32">
                                            <img src="/images/dishes/burrito-bowl.png" className="w-full h-full rounded" />
                                        </div>

                                        <div className="swiper-slide cursor-pointer !w-20 !h-20 lg:!w-32 lg:!h-32">
                                            <img src="/images/dishes/burrito-bowl-2.png" className="w-full h-full rounded" />
                                        </div>

                                        <div className="swiper-slide cursor-pointer !w-20 !h-20 lg:!w-32 lg:!h-32">
                                            <img src="/images/dishes/burrito-bowl-3.png" className="w-full h-full rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border rounded-lg border-default-200">
                            <h3 className="text-4xl font-medium text-default-800 mb-1">Burrito Bowl</h3>
                            <h5 className="text-lg font-medium text-default-600 mb-2"><span className="text-base font-normal text-default-500">by</span> Blaze Pizza</h5>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex gap-1.5">
                                    <span><i className="iconify fa7-solid--star text-base text-yellow-400"></i></span>
                                    <span><i className="iconify fa7-solid--star text-base text-yellow-400"></i></span>
                                    <span><i className="iconify fa7-solid--star text-base text-yellow-400"></i></span>
                                    <span><i className="iconify fa7-solid--star text-base text-yellow-400"></i></span>
                                    <span><i className="iconify fa7-solid--star-half-stroke text-base text-yellow-400"></i></span>
                                </div>
                                <div className="h-4 w-px bg-default-400"></div>
                                <h5 className="text-sm text-default-500">54 Reviews</h5>
                            </div>

                            <p className="text-sm text-default-500 mb-4">Mexican burritos are usually made with a wheat tortilla and contain grilled meat, cheese toppings, and fresh vegetables which are sources of vitamins, proteins, fibers, minerals, and antioxidants.
                                This makes burritos a balanced meal that can be enjoyed in moderation as part of a healthy meal plan.</p>

                            <div className="flex flex-wrap gap-2 mb-5">
                                <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center gap-2.5">
                                    <img src="/images/icons/non-veg.svg" className="w-4 h-4" />
                                    <span className="text-xs">Non Vegetable</span>
                                </div>

                                <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                    <span className="text-xs">Mexican</span>
                                </div>

                                <div className="border border-default-200 rounded-full px-3 py-1.5 flex items-center">
                                    <span className="text-xs">Breakfast</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <h4 className="text-sm text-default-700">Size :</h4>

                                <div>
                                    <input type="radio" name="option" id="1" value="1" className="peer hidden" defaultChecked />
                                    <label htmlFor="1" className="w-9 h-9 flex justify-center items-center cursor-pointer select-none rounded-full text-sm text-center bg-default-200 peer-checked:bg-primary peer-checked:text-white">S</label>
                                </div>

                                <div>
                                    <input type="radio" name="option" id="2" value="2" className="peer hidden" />
                                    <label htmlFor="2" className="w-9 h-9 flex justify-center items-center cursor-pointer select-none rounded-full text-sm text-center bg-default-200 peer-checked:bg-primary peer-checked:text-white">M</label>
                                </div>

                                <div>
                                    <input type="radio" name="option" id="3" value="3" className="peer hidden" />
                                    <label htmlFor="3" className="w-9 h-9 flex justify-center items-center cursor-pointer select-none rounded-full text-sm text-center bg-default-200 peer-checked:bg-primary peer-checked:text-white">L</label>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-8">
                                <div className="relative z-10 inline-flex justify-between border border-default-200 p-1 rounded-full">
                                    <button type="button" className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-9 w-9 text-sm inline-flex items-center justify-center">–</button>
                                    <input type="text" className="w-12 border-0 text-sm text-center focus:ring-0 p-0 bg-transparent" defaultValue="1" min={0} max={100} readOnly />
                                    <button type="button" className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-9 w-9 text-sm inline-flex items-center justify-center">+</button>
                                </div>

                                <a href="cart" className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500">
                                    Buy Now
                                </a>

                                <i data-lucide="heart" className="h-8 w-8 text-default-400 cursor-pointer hover:fill-red-600 hover:text-red-600 focus:fill-red-600 focus:text-red-600"></i>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-default-700 mb-4">Nutrition Facts <span className="text-sm text-default-400">(per serving)</span></h4>

                                <div className="border border-default-200 p-3 rounded-lg">
                                    <div className="grid grid-cols-4 justify-center">
                                        <div className="text-center">
                                            <h4 className="text-base font-medium text-default-700 mb-1">1524</h4>
                                            <h4 className="text-base text-default-700">Calories</h4>
                                        </div>

                                        <div className="text-center">
                                            <h4 className="text-base font-medium text-default-700 mb-1">56g</h4>
                                            <h4 className="text-base text-default-700">Fat</h4>
                                        </div>

                                        <div className="text-center">
                                            <h4 className="text-base font-medium text-default-700 mb-1">134g</h4>
                                            <h4 className="text-base text-default-700">Carbs</h4>
                                        </div>

                                        <div className="text-center">
                                            <h4 className="text-base font-medium text-default-700 mb-1">78g</h4>
                                            <h4 className="text-base text-default-700">Protein</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <i data-lucide="eye" className="w-5 h-5 me-2 text-primary"></i>
                                <h5 className="text-sm text-default-600"><span className="text-primary font-semibold">152</span>&nbsp; People are viewing this right now</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

