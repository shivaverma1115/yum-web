import React from 'react'

export default function ProductsList() {
    return (
        <div className="grid grid-cols-1">
            <div className="border rounded-lg border-default-200">
                <div className="px-6 py-4 overflow-hidden ">
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                        <h2 className="text-xl text-default-800 font-semibold">Item List</h2>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 rounded-md bg-default-100 transition-all">
                                    Save as Draft <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                </button>

                                <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                    <ul className="flex flex-col gap-1">
                                        <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">All</a></li>
                                        <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Publish</a></li>
                                        <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Save as Draft</a></li>
                                        <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Discard</a></li>
                                    </ul>
                                </div>
                            </div>
                            <a href="admin/products/add" className="py-2.5 px-4 inline-flex rounded-lg text-sm font-medium bg-primary text-white transition-all hover:bg-primary-500">Add Product</a>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-default-200">
                                <thead className="bg-default-100">
                                    <tr className="text-start">
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Product</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Type</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Price</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Quantity</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Create By</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Status</th>
                                        <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-default-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/pizza.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Veg Pizza</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Italian</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$45</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">80</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/bbq.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Paneer BBQ</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">BBQ</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$40</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">75</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/bread.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Bread</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Italian</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$10</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">120</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/cooki.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Cookies Bisticks </p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Cooki</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$10</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">90</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500">Draft</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/rice.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Veg Rice</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Italian</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$25</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">40</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/salad.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Salad</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">salad</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$20</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">45</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500">Draft</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/small/pizza-2.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Mushroom Pizza</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Italian</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$50</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">20</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                            <a href="admin/products/details" className="flex items-center gap-3">
                                                <div className="shrink">
                                                    <img src="/images/dishes/burrito-bowl.png" className="h-12 w-12" />
                                                </div>
                                                <p className="text-base text-default-500 transition-all hover:text-primary">Burrito Bowl</p>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Mexican</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$45</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">80</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">Admin</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Publish</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href="admin/products/1/edit" className="transition-all hover:text-primary"><i data-lucide="pencil" className="w-5 h-5"></i></a>
                                                <a href="admin/products/details" className="transition-all hover:text-primary"><i data-lucide="eye" className="w-5 h-5"></i></a>
                                                <a href="javascript:void(0)" className="transition-all hover:text-red-500"><i data-lucide="trash-2" className="w-5 h-5"></i></a>
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
    )
}

