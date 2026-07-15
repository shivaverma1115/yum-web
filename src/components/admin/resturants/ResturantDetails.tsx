import React from 'react'

interface ResturantDetailsProps {
    restaurantId: string;
}

export default function ResturantDetails({ restaurantId }: ResturantDetailsProps) {
    return (
        <div>
            <div className="p-6 rounded-lg border border-default-200 mb-6">
                <img src="/images/restaurants/bg.png" className="w-full md:flex hidden" />

                <div className="flex md:items-end items-center gap-3 md:-mt-14">
                    <img src="/images/restaurants/1.png" className="w-28 h-28 bg-default-50 rounded-full" />
                    <div>
                        <h4 className="text-base font-medium text-default-800 mb-1">Healthy Feast Corner</h4>
                        <p className="text-sm text-default-600">Since 2013</p>
                    </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 grid-cols-1 gap-6">
                <div className="xl:col-span-2">
                    <div className="p-6 rounded-lg border border-default-200 mb-6">
                        <div className="flex justify-between">
                            <h4 className="text-xl font-medium text-default-900">Cost & Usage by instance type</h4>

                            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                    Last Month <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                </button>

                                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] dark:bg-default-50 rounded-lg border border-default-100 p-1.5">
                                    <ul className="flex flex-col gap-1">
                                        <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">Last Day</a></li>
                                        <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Lat 6 Month</a></li>
                                        <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Lat Year</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div id="customer_impression_charts" className="apex-charts" dir="ltr"></div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-default-200 overflow-hidden">
                        <div className="p-6 border-b border-b-default-200">

                            <h4 className="text-xl font-medium text-default-900 mb-4">Product</h4>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="hs-dropdown relative inline-flex">
                                    <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                        Price <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                        <ul className="flex flex-col gap-1">
                                            <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">Populer</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">High to Low</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Low to High</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="hs-dropdown relative inline-flex">
                                    <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                        Upload Date <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                        <ul className="flex flex-col gap-1">
                                            <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">All</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Newest</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Best Seller</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Oldest</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="hs-dropdown relative inline-flex">
                                    <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                        Score Status <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                        <ul className="flex flex-col gap-1">
                                            <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">Average</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Good</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Best</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="hs-dropdown relative inline-flex">
                                    <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                        Category <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5  dark:bg-default-50">
                                        <ul className="flex flex-col gap-1">
                                            <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">All</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Beverages</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Wrap</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Pizza</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Bakery</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="ms-auto">
                                    <button type="button" className="flex items-center gap-2 font-medium text-sm py-2.5 px-4 xl:px-5 rounded-full bg-primary text-white transition-all">
                                        <i data-lucide="plus" className="h-4 w-4"></i> Add Product
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                                <div className="rounded-lg divide-y divide-default-200">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-default-200">
                                            <thead className="bg-default-100/75">
                                                <tr>
                                                    <th scope="col" className="py-3 px-4 pr-0">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-all" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-all" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-start text-base whitespace-nowrap font-medium text-default-500">Products</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-base whitespace-nowrap font-medium text-default-500">Category</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-base whitespace-nowrap font-medium text-default-500">Price</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-base whitespace-nowrap font-medium text-default-500">Product ID</th>
                                                    <th scope="col" className="px-6 py-3 text-start text-base whitespace-nowrap font-medium text-default-500">Score Status</th>
                                                    <th scope="col" className="px-6 py-3 text-end text-base whitespace-nowrap font-medium text-default-500">Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-default-200">
                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/pizza.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Veg Cheese Wrap</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Wrap</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS20342</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Average</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/salad.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Strawberry Smoothie</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Beverages</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS20314</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Good</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/burger.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Charcoal Burger</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Burger</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS20104</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Average</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/cooki.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Jelly Cheese Cake</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Bakery</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS20450</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Average</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/bbq.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Vietnam Spring Rolls</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Bakery</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS20450</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Average</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/burger.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Beef Cheese Burger</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Burger</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS12781</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Good</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 pl-4">
                                                        <div className="flex items-center h-5">
                                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img src="/images/dishes/small/pizza-2.png" className="w-12 h-12 rounded-full" />
                                                            <h5 className="text-base font-medium text-default-700">Margherita Pizza</h5>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Pizza</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">$14.99</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">#ADS74526</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Average</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                                            <button type="button" className="hs-dropdown-toggle inline-flex font-medium text-default-600 transition-all">
                                                                <i data-lucide="more-vertical" className="h-6 w-6"></i>
                                                            </button>

                                                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[150px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                                                <ul className="flex flex-col gap-1">
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Edit</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">View</a></li>
                                                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Delete</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1">
                    <div className="rounded-lg border border-default-200 mb-6">
                        <div className="p-6 border-b border-b-default-300">
                            <h4 className="text-xl font-medium text-default-900">Seller Personal Detail</h4>
                        </div>

                        <div className="px-6 py-5">
                            <table cellPadding={10}>
                                <tbody>
                                    <tr>
                                        <td className="text-start text-base font-medium">Owner Name:</td>
                                        <td className="text-start">Kianna Vetrovs</td>
                                    </tr>

                                    <tr>
                                        <td className="text-start text-base font-medium">Company Type:</td>
                                        <td className="text-start">Partnership</td>
                                    </tr>

                                    <tr>
                                        <td className="text-start text-base font-medium">Email:</td>
                                        <td className="text-start">kianna.vetrov@mail.com</td>
                                    </tr>

                                    <tr>
                                        <td className="text-start text-base font-medium">Contact No:</td>
                                        <td className="text-start">+(123) 456 7890</td>
                                    </tr>

                                    <tr>
                                        <td className="text-start text-base font-medium">Fax:</td>
                                        <td className="text-start">+1 453 345 3424</td>
                                    </tr>

                                    <tr>
                                        <td className="text-start text-base font-medium">Location:</td>
                                        <td className="text-start">Canada</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-lg border border-default-200 mb-6">
                        <div className="p-6 border-b border-b-default-300">
                            <h4 className="text-xl font-medium text-default-900">Customer Reviews</h4>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm">5</h5>
                                    <div className="flex bg-default-100 rounded-lg w-full h-2 overflow-hidden">
                                        <div className="w-full bg-yellow-400 rounded-lg"></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm">4</h5>
                                    <div className="flex bg-default-100 rounded-lg w-full h-2 overflow-hidden">
                                        <div className="w-4/5 bg-yellow-400 rounded-lg"></div>
                                    </div>
                                </div>


                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm">3</h5>
                                    <div className="flex bg-default-100 rounded-lg w-full h-2 overflow-hidden">
                                        <div className="w-3/5 bg-yellow-400 rounded-lg"></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm">2</h5>
                                    <div className="flex bg-default-100 rounded-lg w-full h-2 overflow-hidden">
                                        <div className="w-2/5 bg-yellow-400 rounded-lg"></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm">1</h5>
                                    <div className="flex bg-default-100 rounded-lg w-full h-2 overflow-hidden">
                                        <div className="w-1/5 bg-yellow-400 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-around mb-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-medium text-default-900 mb-1">4.5 <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i></h2>
                                    <p className="block text-xs text-default-600">452 Reviews</p>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-2xl font-medium text-default-900 mb-1">91%</h2>
                                    <p className="block text-xs text-default-600">Recommended</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex gap-3 items-center mb-4">
                                    <img src="/images/avatars/avatar1.png" className="w-11 h-11 rounded-full" />
                                    <div className="flex-grow">
                                        <h4 className="text-xs text-default-700 mb-1">Kianna Stanton <span className="text-default-600">🇺🇸US</span></h4>
                                        <h4 className="text-xs text-green-400">Verified Buyer</h4>
                                    </div>

                                    <div>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                    </div>
                                </div>

                                <h5 className="text-sm text-default-600 mb-2">SO DELICIOUS 🍯💯</h5>
                                <p className="text-sm text-default-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
                            </div>

                            <div className="mb-4">
                                <div className="flex gap-3 items-center mb-4">
                                    <img src="/images/avatars/avatar2.png" className="w-11 h-11 rounded-full" />
                                    <div className="flex-grow">
                                        <h4 className="text-xs text-default-700 mb-1">Ryan Rhiel Madsen <span className="text-default-600">🇺🇸US</span></h4>
                                        <h4 className="text-xs text-green-400">Verified Buyer</h4>
                                    </div>

                                    <div>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                        <i className="inline-flex align-middle w-5 h-5 text-yellow-400 fill-yellow-400" data-lucide="star"></i>
                                    </div>
                                </div>

                                <h5 className="text-sm text-default-600 mb-2">SO DELICIOUS 🍯💯</h5>
                                <p className="text-sm text-default-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-default-200">
                        <div className="p-6 border-b border-b-default-300">
                            <h4 className="text-xl font-medium text-default-900">Customer Support</h4>
                        </div>

                        <div className="p-6">
                            <textarea className="form-textarea bg-transparent rounded w-full border border-default-200 focus:border-default-200 mb-4" placeholder="Message" rows={4}></textarea>
                            <button className="px-6 py-3 rounded-full bg-primary text-white flex ms-auto">Send Message</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

