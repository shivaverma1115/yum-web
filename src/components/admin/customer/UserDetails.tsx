import React from 'react'

interface UserDetailsProps {
    userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
    return (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
            <div className="lg:col-span-1">
                <div className="p-6 rounded-lg border border-default-200">
                    <img src="/images/avatars/avatar1.png" alt="" className="w-24 rounded-full p-1 border border-gray-200 bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
                    <h4 className="mb-1 mt-3 text-lg">Kaiya Botosh</h4>

                    <div className="text-start mt-6">
                        <h4 className="text-sm uppercase mb-2.5">About Me :</h4>
                        <p className="text-gray-400 mb-6">
                            Hi I'm Kaiya Botosh,has been the industry's standard dummy text ever since the
                            1500s, when an unknown printer took a galley of type.
                        </p>
                        <p className="text-zinc-400 mb-3"><b>Full Name :</b> <span className="ms-2">Kaiya Botosh</span></p>

                        <p className="text-zinc-400 mb-3"><b>Mobile :</b><span className="ms-2">(123) 123 1234</span></p>

                        <p className="text-zinc-400 mb-3"><b>Email :</b> <span className="ms-2 ">user@email.domain</span></p>

                        <p className="text-zinc-400 mb-1.5"><b>Location :</b> <span className="ms-2">USA</span></p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="border rounded-lg border-default-200">
                    <div className="px-6 py-4">
                        <div className="flex flex-wrap justify-between items-center gap-6">
                            <h4 className="text-xl font-medium text-default-900">Customer Order history</h4>

                            <div className="flex items-center">
                                <span className="text-base text-default-950 me-3">Sort By :</span>

                                <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                    <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-950 text-sm py-2.5 px-4 xl:px-5 rounded-lg border border-default-200 transition-all">
                                        All <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white dark:bg-default-50 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5">
                                        <ul className="flex flex-col gap-1">
                                            <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-400/20 rounded" href="javascript:void(0)">All</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Refund</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Paid</a></li>
                                            <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Cancel</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            <div className="rounded-lg divide-y divide-default-200">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-default-200">
                                        <thead className="bg-default-100">
                                            <tr className="text-start">
                                                <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Date</th>
                                                <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Order ID</th>
                                                <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w">Menu</th>
                                                <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800">Amount</th>
                                                <th className="px-6 py-3 text-start text-sm whitespace-nowrap font-medium text-default-800 min-w-[10rem]">Status</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-default-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">01/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4357</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/pizza.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>

                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Veg Pizza</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(54)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$45.24</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-500">Refund</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">01/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4358</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/bread.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>
                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Butter Bread</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(23)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$50.34</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-green-500/20 text-green-500">Paid</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">04/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4360</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/rice.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>

                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Mutton Biryani</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(12)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$34.21</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-red-500/20 text-red-500">Cancel</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">04/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4359</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/pizza-2.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>

                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Seafood Pizza</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(25)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$25.00</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-green-500/20 text-green-500">Paid</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">07/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4361</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/cooki.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>

                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Butter Cookies</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(25)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$49.99</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-amber-500/20 text-amber-500">Refund</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">10/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4362</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/salad.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>
                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Fresh Salad</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(46)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$24.19</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-amber-500/20 text-amber-500">Refund</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">12/Sep/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4363</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/bbq.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>
                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Barbeque</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(25)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$15.43</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-green-500/20 text-green-500">Paid</span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">31/Aug/22</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">#4356</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="shrink">
                                                            <div className="h-11 w-11">
                                                                <img src="/images/dishes/small/burger.png" className="max-w-full h-full" />
                                                            </div>
                                                        </div>
                                                        <div className="grow">
                                                            <p className="text-sm text-default-500 mb-1">Burger</p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1.5">
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-yellow-400 fill-yellow-400"></i></button>
                                                                    <button><i data-lucide="star" className="h-5 w-5 text-default-200 fill-default-200"></i></button>
                                                                </div>
                                                                <h6 className="text-xs text-default-500 mt-1">(42)</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-500">$28.99</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 py-1 px-4 rounded-full text-sm font-medium bg-green-500/20 text-green-500">Paid</span>
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
        </div>
    )
}

