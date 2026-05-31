import React from 'react'

export default function Home() {
    return (
        <div>
            <section className="lg:py-16 py-6 relative">
                <div className="absolute inset-0 blur-[60px] bg-gradient-to-l from-orange-600/20 via-orange-600/5 to-orange-600/0"></div>
                <div className="container relative">
                    <div className="grid lg:grid-cols-2 items-center">
                        <div className="py-20 px-10">
                            <div className="flex items-center justify-center lg:justify-start order-last lg:order-first z-10">
                                <div className="text-center lg:text-start">
                                    <span className="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-8 lg:mb-2">#Special Food 🍇</span>
                                    <h1 className="lg:text-6xl/normal md:text-5xl/snug text-3xl font-bold text-default-950 capitalize mb-5">We Offer
                                        <span className="inline-flex relative">
                                            <span>Delicious</span>
                                            <img src="/images/home/circle-line.png" className="absolute -z-10 h-full w-full lg:flex hidden" />
                                        </span>
                                        <span className="text-primary">Food</span> And Quick Service
                                    </h1>

                                    <p className="text-lg text-default-700 font-medium mb-8 md:max-w-md lg:mx-0 mx-auto">Imagine you don’t need a diet because we provide healthy and delicious food for you!.</p>
                                    <div className="flex flex-wrap items-center justify-center lg:justify-normal gap-5 mt-10">
                                        <a href="javascript:void(0)" className="py-5 px-10 font-medium text-white bg-primary rounded-full hover:bg-primary-500 transition-all">Order Now</a>
                                        <a href="javascript:void(0)" className="text-primary flex items-center">
                                            <span className="h-14 w-14 rounded-full border-2 border-e-transparent border-yellow-400 flex items-center justify-center me-2">
                                                <i data-lucide="play" className="h-6 w-6 fill-primary"></i>
                                            </span>
                                            <span className="font-semibold">How to Order</span>
                                        </a>
                                    </div>

                                    <div className="mt-14">
                                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                            <div className="flex items-center -space-x-1">
                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-50" src="//images/avatars/avatar1.png" />
                                                </div>

                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-50" src="/images/avatars/avatar2.png" />
                                                </div>

                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-50" src="/images/avatars/avatar3.png" />
                                                </div>
                                            </div>

                                            <div>
                                                <h1 className="text-base font-medium text-default-800">Our Happy Customer</h1>
                                                <p className="text-base text-default-900"><i data-lucide="star" className="h-4 w-4 inline text-yellow-400 fill-yellow-400"></i> 4.7 <span className="text-default-500 text-sm">(13.7k Reviews)</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center py-20">
                            <span className="absolute top-0 start-0 text-3xl -rotate-[40deg]">🔥</span>
                            <span className="absolute top-0 end-[10%] -rotate-12 h-14 w-14 inline-flex items-center justify-center bg-yellow-400 text-white rounded-lg">
                                <i data-lucide="clock-3" className="h-6 w-6"></i>
                            </span>

                            <span className="absolute top-1/4 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded"></span>
                            <div className="absolute bottom-1/4 -end-0 2xl:-end-24 hidden md:block lg:hidden xl:block">
                                <img src="/images/home/arrow.png" />
                                <div className="flex items-center gap-2 p-2 pe-6 bg-default-50 rounded-full shadow-lg">
                                    <img src="/images/avatars/avatar1.png" className="h-16 w-16 rounded-full" />
                                    <div>
                                        <h6 className="text-sm font-medium text-default-900">Jakob Culhane</h6>
                                        <p className="text-[10px] font-medium text-default-900">Healthy and Delicious Food</p>
                                        <span className="inline-flex gap-0.5">
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-default-200 fill-default-200"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span className="absolute bottom-0 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
                            <span className="absolute -bottom-16 end-1/3 text-3xl">🔥</span>
                            <div className="absolute bottom-0 start-0">
                                <div className="flex items-center gap-2 p-2 pe-6 bg-default-50 rounded-full shadow-lg">
                                    <span className="inline-flex items-center justify-center h-16 w-16 bg-primary/20 rounded-full"><img src="/images/icons/category/burger-1.svg" className="h-10 w-10 rounded-full" /></span>
                                    <div>
                                        <h6 className="text-sm font-medium text-default-900">MCD Veg Burger</h6>
                                        <span className="inline-flex gap-0.5">
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-yellow-400 fill-yellow-400"></i>
                                            <i data-lucide="star" className="h-3 w-3 text-default-200 fill-default-200"></i>
                                        </span>
                                        <h6 className="text-sm font-medium text-default-900"><span className="text-sm text-primary">$</span> 8.14</h6>
                                    </div>
                                </div>
                            </div>

                            <img src="/images/home/hero.png" className="mx-auto" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-2 items-start gap-10">
                        <div className="flex items-center justify-center h-full w-full bg-default-500/5 rounded-lg">
                            <img src="/images/home/about-us.png" className="h-full w-full" />
                        </div>

                        <div>
                            <span className="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-6">About Us</span>
                            <h2 className="text-3xl font-semibold text-default-900 max-w-xl mb-6">Where quality food meet Excellent services.</h2>
                            <p className="text-default-500 font-medium max-w-2xl mb-16 xl:mb-20">It’s the perfect dining experience where every dish is crafted with fresh, high-quality ingredients and served by friendly staff who go.</p>

                            <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-6">
                                <div className="bg-transparent rounded-md shadow-lg border border-default-100 hover:border-primary transition-all duration-200">
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <img src="/images/icons/cup.png" />
                                        </div>
                                        <h3 className="text-xl font-medium text-default-900 mb-6">Fast Foods</h3>
                                        <p className="text-base text-default-500">Healthy Foods are nutrient-Dense Foods</p>
                                    </div>
                                </div>

                                <div className="bg-transparent rounded-md shadow-lg border border-default-100 hover:border-primary transition-all duration-200">
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <img src="/images/icons/vegetables.png" />
                                        </div>
                                        <h3 className="text-xl font-medium text-default-900 mb-6">Healthy Foods</h3>
                                        <p className="text-base text-default-500">Healthy Foods are nutrient-Dense Foods</p>
                                    </div>
                                </div>

                                <div className="bg-transparent rounded-md shadow-lg border border-default-100 hover:border-primary transition-all duration-200">
                                    <div className="p-6">
                                        <div className="mb-6">
                                            <img src="/images/icons/truck.png" />
                                        </div>
                                        <h3 className="text-xl font-medium text-default-900 mb-6">Fast Delivery</h3>
                                        <p className="text-base text-default-500">Healthy Foods are nutrient-Dense Foods</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center md:justify-start justify-center gap-4 mt-10">
                                <a href="javascript:void(0)" className="py-3 px-10 font-medium text-white bg-primary rounded-full hover:bg-primary-500 transition-all">Get started</a>
                                <div className="flex items-center gap-2">
                                    <img src="/images/avatars/avatar3.png" className="h-12 w-12 rounded-full" />
                                    <div>
                                        <h6 className="text-base font-medium text-default-900">Marley Culhane</h6>
                                        <p className="text-sm font-medium text-default-500">Founder CEO</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-4 lg:gap-10 gap-6">
                        <div>
                            <div>
                                <span className="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-6">Menu</span>
                                <h2 className="text-3xl font-semibold text-default-900 mb-6">Special Menu for you...</h2>
                            </div>

                            <div className="flex flex-wrap w-full">
                                <div className="lg:h-[30rem] h-auto lg:w-full w-screen custom-scroll overflow-auto lg:mx-0 -mx-4 px-2">
                                    <nav className="flex lg:flex-col gap-2" aria-label="Tabs" role="tablist" data-hs-tabs-vertical="true">
                                        <button type="button" className="flex p-1" id="coffee-menu-item" data-hs-tab="#coffee-menu" aria-controls="coffee-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/cup.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Coffee</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1" id="burger-menu-item" data-hs-tab="#burger-menu" aria-controls="burger-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/burger-1.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Burger</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1" id="noodles-menu-item" data-hs-tab="#noodles-menu" aria-controls="noodles-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/noodles.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Noodles</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1 active" id="pizza-menu-item" data-hs-tab="#pizza-menu" aria-controls="pizza-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white  p-4 h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/pizza-slice 1.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Pizza</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1" id="wraps-menu-item" data-hs-tab="#wraps-menu" aria-controls="wraps-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/taco.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Wraps</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1" id="appetizers-menu-item" data-hs-tab="#appetizers-menu" aria-controls="appetizers-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/skewer.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Appetizers</span>
                                            </span>
                                        </button>

                                        <button type="button" className="flex p-1" id="desserts-menu-item" data-hs-tab="#desserts-menu" aria-controls="desserts-menu" role="tab">
                                            <span className="hs-tab-active:bg-primary text-default-900 flex items-center justify-start gap-4 p-2 pe-6 lg:w-2/3 w-full transition-all hover:text-primary rounded-full">
                                                <span className="hs-tab-active:bg-white h-14 w-14 inline-flex items-center justify-center rounded-full">
                                                    <img src="/images/icons/category/dessert.svg" className="h-8 w-8" />
                                                </span>
                                                <span className="hs-tab-active:text-white text-base font-medium">Desserts</span>
                                            </span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="relative lg:mt-24">
                                <div className="bg-primary/10 rounded-lg lg:pb-16">
                                    <div className="lg:p-6 p-4">
                                        <div id="pizza-menu" role="tabpanel" aria-labelledby="pizza-menu-item">
                                            <div className="grid grid-cols-1">
                                                <div className="swiper menu-swiper w-full h-full">
                                                    <div className="swiper-wrapper">
                                                        <div className="swiper-slide">
                                                            <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                                <img src="/images/home/banner/pizza-1.png" className="h-full w-full" />
                                                                <div className="absolute inset-0 bg-default-950/20">
                                                                    <div className="inline-flex items-end h-full w-full">
                                                                        <div className="p-6">
                                                                            <h5 className="text-xl font-medium text-white mb-2">Italian Pizza</h5>
                                                                            <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 8.75</h5>
                                                                            <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="swiper-slide">
                                                            <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                                <img src="/images/home/banner/pizza-2.png" className="h-full w-full" />
                                                                <div className="absolute inset-0 bg-default-950/20">
                                                                    <div className="inline-flex items-end h-full w-full">
                                                                        <div className="p-6">
                                                                            <h5 className="text-xl font-medium text-white mb-2">Margarita Pizza</h5>
                                                                            <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 5.86</h5>
                                                                            <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="swiper-slide">
                                                            <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                                <img src="/images/home/banner/pizza-3.png" className="h-full w-full" />
                                                                <div className="absolute inset-0 bg-default-950/20">
                                                                    <div className="inline-flex items-end h-full w-full">
                                                                        <div className="p-6">
                                                                            <h5 className="text-xl font-medium text-white mb-2">Vegetarian Pizza</h5>
                                                                            <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 9.56</h5>
                                                                            <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="swiper-slide">
                                                            <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                                <img src="/images/home/banner/pizza-4.png" className="h-full w-full" />
                                                                <div className="absolute inset-0 bg-default-950/20">
                                                                    <div className="inline-flex items-end h-full w-full">
                                                                        <div className="p-6">
                                                                            <h5 className="text-xl font-medium text-white mb-2">Turkish pizza</h5>
                                                                            <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 8.75</h5>
                                                                            <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="burger-menu" className="hidden" role="tabpanel" aria-labelledby="burger-menu-item">
                                            <div className="grid grid-cols-1">
                                                <div className="swiper menu-swiper w-full h-full" />
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide">
                                                        <div className="relative rounded-lg overflow-hidden cursor-pointer" />
                                                        <img src="/images/home/banner/burger-1.png" className="h-full w-full" />
                                                        <div className="absolute inset-0 bg-default-950/20">
                                                            <div className="inline-flex items-end h-full w-full">
                                                                <div className="p-6">
                                                                    <h5 className="text-xl font-medium text-white mb-2">Cheese Burger</h5>
                                                                    <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 5.99</h5>
                                                                    <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="swiper-slide">
                                                    <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                        <img src="/images/home/banner/burger-2.png" className="h-full w-full" />
                                                        <div className="absolute inset-0 bg-default-950/20">
                                                            <div className="inline-flex items-end h-full w-full">
                                                                <div className="p-6">
                                                                    <h5 className="text-xl font-medium text-white mb-2">Fried Egg Burger</h5>
                                                                    <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.75</h5>
                                                                    <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="swiper-slide">
                                                    <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                        <img src="/images/home/banner/burger-3.png" className="h-full w-full" />
                                                        <div className="absolute inset-0 bg-default-950/20">
                                                            <div className="inline-flex items-end h-full w-full">
                                                                <div className="p-6">
                                                                    <h5 className="text-xl font-medium text-white mb-2">Meat Burger</h5>
                                                                    <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 19.25</h5>
                                                                    <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="swiper-slide">
                                                    <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                        <img src="/images/home/banner/burger-4.png" className="h-full w-full" />
                                                        <div className="absolute inset-0 bg-default-950/20">
                                                            <div className="inline-flex items-end h-full w-full">
                                                                <div className="p-6">
                                                                    <h5 className="text-xl font-medium text-white mb-2">Gourmet cheeseburger</h5>
                                                                    <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 16.52</h5>
                                                                    <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="coffee-menu" className="hidden" role="tabpanel" aria-labelledby="coffee-menu-item">
                                    <div className="grid grid-cols-1">
                                        <div className="swiper menu-swiper w-full h-full" />
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/coffee-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Espresso Coffee</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 5.99</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/coffee-2.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Cappuccino</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.45</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/coffee-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Iced Cold Coffee</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 25.14</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/coffee-4.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Flat white</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 8.75</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="desserts-menu" className="hidden" role="tabpanel" aria-labelledby="desserts-menu-item">
                                <div className="grid grid-cols-1">
                                    <div className="swiper menu-swiper w-full h-full">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/cake-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Brownie Cake</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.99</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/cake-2.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Berry Cheesecake</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 18.25</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/cake-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Chocolate Donuts</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 35.46</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/cake-4.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Carrot Cake</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 19.62</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="noodles-menu" className="hidden" role="tabpanel" aria-labelledby="noodles-menu-item">
                                <div className="grid grid-cols-1">
                                    <div className="swiper menu-swiper w-full h-full">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/noodles-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Asian Noodles</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.78</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/noodles-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Meat Noodles</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 31.00</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/noodles-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Veg Noodles</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 22.99</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/noodles-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Italian Noodles Pasta</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 18.82</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="wraps-menu" className="hidden" role="tabpanel" aria-labelledby="wraps-menu-item">
                                <div className="grid grid-cols-1">
                                    <div className="swiper menu-swiper w-full h-full">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/wraps-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Asian wraps</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.78</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/wraps-2.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Meat wraps</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 31.00</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/wraps-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Veg wraps</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 22.99</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/wraps-4.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Buritto wraps Pasta</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 18.82</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="appetizers-menu" className="hidden" role="tabpanel" aria-labelledby="appetizers-menu-item">
                                <div className="grid grid-cols-1">
                                    <div className="swiper menu-swiper w-full h-full">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/appetizer-1.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Veg Salad</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 12.78</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/appetizer-2.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Chicken Skewers </h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 31.00</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/appetizer-3.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Nachos Salsa Dip</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 22.99</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="swiper-slide">
                                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                                    <img src="/images/home/banner/appetizer-4.png" className="h-full w-full" />
                                                    <div className="absolute inset-0 bg-default-950/20">
                                                        <div className="inline-flex items-end h-full w-full">
                                                            <div className="p-6">
                                                                <h5 className="text-xl font-medium text-white mb-2">Paneer tikka Skewers</h5>
                                                                <h5 className="text-xl font-semibold text-white mb-2"><span className="text-base font-medium text-yellow-400">$</span> 18.82</h5>
                                                                <a href="products" className="inline-flex items-center text-white border-b border-dashed border-white">Order Now <i data-lucide="chevron-right" className="h-5 w-5"></i></a>
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
                    </div>

                    <div className="lg:flex items-center gap-1 absolute !-top-10 !end-15 hidden">
                        <div className="swiper-button-next after:content-[] h-12 w-12 flex justify-center items-center rounded-full text-white bg-primary transition-all">
                        </div>

                        <div className="swiper-button-prev after:content-[] h-12 w-12 flex justify-center items-center rounded-full text-white bg-primary transition-all">
                        </div>
                    </div>

                    <div className="lg:flex hidden">
                        <div className="swiper-pagination !bottom-12 !start-0"></div>

                        <span className="absolute bottom-0 start-1/4 z-10">
                            <img src="/images/home/onion.png" />
                        </span>

                        <span className="absolute -bottom-12 -end-0 z-10">
                            <img src="/images/home/leaf.png" />
                        </span>
                    </div>
                </div>
            </section >

            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-20">
                        <div>
                            <div className="relative">
                                <img src="/images/home/testimonial-img.png" className="lg:mx-0 mx-auto" />

                                <div className="absolute -bottom-10 end-20">
                                    <div className="bg-white shadow-lg rounded-xl dark:bg-default-100">
                                        <div className="p-6">
                                            <h6 className="text-base font-semibold text-default-900 mb-2">Our Reviewers</h6>
                                            <div className="flex items-center justify-center -space-x-1">
                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-100" src="/images/avatars/avatar1.png" />
                                                </div>

                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-100" src="/images/avatars/avatar2.png" />
                                                </div>

                                                <div className="h-12 w-12">
                                                    <img className="h-full w-full rounded-full object-cover object-center ring ring-default-100" src="/images/avatars/avatar3.png" />
                                                </div>

                                                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary text-default-50 font-medium ring ring-default-100">
                                                    <span className="text-base"> 12K </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-6">Testimonials</span>
                            <h2 className="text-3xl font-semibold text-default-900 max-w-xl mb-4">What They Say About Us.</h2>

                            <div className="product-img-slider sticky-side-div">
                                <div className="swiper clients-testimonial p-2 ">
                                    <div className="swiper-wrapper mb-4">
                                        <div className="swiper-slide">
                                            <div className="relative cursor-pointer">
                                                <div className="flex items-center gap-3 mb-12">
                                                    <img src="/images/avatars/avatar1.png" className="h-12 w-12 rounded-full" />
                                                    <div>
                                                        <h6 className="text-base/none font-medium text-default-900 mb-2">Madelyn Baptista</h6>
                                                        <div className="flex gap-1.5">
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative px-12">
                                                    <div className="absolute -top-5 start-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary rotate-180"></i>
                                                    </div>

                                                    <div className="absolute -bottom-5 end-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary"></i>
                                                    </div>
                                                    <p className="text-base text-default-400 font-medium">Food is the best. Besides the many and delicious meals, the service is also very good, especially in the very fast delivery. I highly recommend Food to you.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="swiper-slide">
                                            <div className="relative cursor-pointer">
                                                <div className="flex items-center gap-3 mb-12">
                                                    <img src="/images/avatars/avatar1.png" className="h-12 w-12 rounded-full" />
                                                    <div>
                                                        <h6 className="text-base/none font-medium text-default-900 mb-2">Marc Y. Sellers</h6>
                                                        <div className="flex gap-1.5">
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative px-12">
                                                    <div className="absolute -top-5 start-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary rotate-180"></i>
                                                    </div>

                                                    <div className="absolute -bottom-5 end-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary"></i>
                                                    </div>
                                                    <p className="text-base text-default-400 font-medium">Food is the best. Besides the many and delicious meals, the service is also very good, especially in the very fast delivery. I highly recommend Food to you.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="swiper-slide">
                                            <div className="relative cursor-pointer">
                                                <div className="flex items-center gap-3 mb-12">
                                                    <img src="/images/avatars/avatar1.png" className="h-12 w-12 rounded-full" />
                                                    <div>
                                                        <h6 className="text-base/none font-medium text-default-900 mb-2">Nancy C. Hunter</h6>
                                                        <div className="flex gap-1.5">
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative px-12">
                                                    <div className="absolute -top-5 start-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary rotate-180"></i>
                                                    </div>

                                                    <div className="absolute -bottom-5 end-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary"></i>
                                                    </div>
                                                    <p className="text-base text-default-400 font-medium">Food is the best. Besides the many and delicious meals, the service is also very good, especially in the very fast delivery. I highly recommend Food to you.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="swiper-slide">
                                            <div className="relative cursor-pointer">
                                                <div className="flex items-center gap-3 mb-12">
                                                    <img src="/images/avatars/avatar1.png" className="h-12 w-12 rounded-full" />
                                                    <div>
                                                        <h6 className="text-base/none font-medium text-default-900 mb-2">Jeannette C. Siebert</h6>
                                                        <div className="flex gap-1.5">
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                            <button><i data-lucide="star" className="h-4 w-4 text-yellow-400 fill-yellow-400"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative px-12">
                                                    <div className="absolute -top-5 start-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary rotate-180"></i>
                                                    </div>

                                                    <div className="absolute -bottom-5 end-0">
                                                        <i data-lucide="quote" className="h-8 w-8 text-primary fill-primary"></i>
                                                    </div>
                                                    <p className="text-base text-default-400 font-medium">Food is the best. Besides the many and delicious meals, the service is also very good, especially in the very fast delivery. I highly recommend Food to you.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="swiper h-24 clients-testimonial-pagination relative !mt-6">
                                    <div className="swiper-wrapper ps-12 !py-6 !space-x-4">
                                        <div className="swiper-slide cursor-pointer !w-12 !h-12">
                                            <img src="/images/avatars/avatar1.png" className="h-12 w-12 rounded-full" />
                                        </div>

                                        <div className="swiper-slide cursor-pointer !w-12 !h-12">
                                            <img src="/images/avatars/avatar2.png" className="h-12 w-12 rounded-full" />
                                        </div>

                                        <div className="swiper-slide cursor-pointer !w-12 !h-12">
                                            <img src="/images/avatars/avatar3.png" className="h-12 w-12 rounded-full" />
                                        </div>

                                        <div className="swiper-slide cursor-pointer !w-12 !h-12">
                                            <img src="/images/avatars/avatar4.png" className="h-12 w-12 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="lg:py-28 py-10 relative bg-no-repeat bg-cover bg-center bg-orange-700"
                style={{ backgroundImage: "url('/images/home/offer-bg.png')" }}
            >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container">
                    <div className="relative lg:w-1/2 w-full">
                        <h4 className="font-handrawn text-2xl text-yellow-500 mb-6">Special Combo Offer</h4>
                        <h2 className="text-4xl font-semibold text-white mb-8">We make best Food in your town</h2>
                        <p className="text-base text-white/75 max-w-2xl mb-10">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                        <div className="inline-flex flex-wrap items-center justify-center gap-4">
                            <a href="javascript:void(0)" className="py-4 px-10 font-medium text-white bg-primary rounded-full hover:bg-primary-500 transition-all">Get started</a>
                            <h4 className="text-yellow-400 font-medium text-2xl">$23.47 <span className="text-lg line-through text-white/75">$44.99</span></h4>
                        </div>

                        <div className="absolute end-0 lg:-bottom-16 bottom-10">
                            <img src="/images/home/offer-popup.svg" className="lg:w-auto w-20" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="bg-primary/10 rounded-lg">
                        <div className="grid lg:grid-cols-2 items-center gap-6">
                            <div className="relative lg:p-20 p-6 h-full">
                                <span className="absolute end-16 top-1/3 text-xl rotate-45">😃</span>
                                <span className="absolute end-0 top-1/2 text-xl rotate-45">🔥</span>
                                <span className="absolute bottom-40 end-40 h-2 w-2 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
                                <div className="hidden sm:block absolute -bottom-10 lg:bottom-10 lg:end-0 end-10">
                                    <div className="bg-default-50 rounded-full p-2 shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full overflow-hidden">
                                                <img src="/images/avatars/avatar4.png" />
                                            </div>

                                            <div>
                                                <h6 className="text-base font-medium text-default-900 mb-1">Richard Watson</h6>
                                                <p className="text-sm font-medium text-default-500">Food Courier</p>
                                            </div>

                                            <div className="h-14 w-14 inline-flex items-center justify-center rounded-full bg-primary text-white">
                                                <i data-lucide="phone"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-6">Download App</span>
                                <h2 className="text-3xl/relaxed font-semibold text-default-900 max-w-sm mb-6">Get Started With Us Today!</h2>
                                <p className="text-default-900 text-base max-w-md mb-10">Discover food wherever and whenever and get your food delivered quickly.</p>
                                <a href="javascript:void(0)" className="inline-flex py-4 px-10 font-medium text-white bg-primary rounded-full hover:bg-primary-500 transition-all">Get started</a>
                            </div>

                            <div className="relative pt-20 px-20">
                                <span className="absolute end-10 bottom-28 text-3xl -rotate-45">🔥</span>
                                <span className="absolute bottom-10 end-20 h-3 w-3 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
                                <span className="absolute top-1/4 end-10 h-2.5 w-2.5 inline-flex items-center justify-center bg-yellow-400 text-white rounded-full"></span>
                                <span className="absolute end-1/4 top-12 text-xl -rotate-45">😋</span>
                                <span className="absolute start-10 top-12 h-2 w-2 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
                                <img src="/images/home/mockup.png" className="max-w-full max-h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    )
}

