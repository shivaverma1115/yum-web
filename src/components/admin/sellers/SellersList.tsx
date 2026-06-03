import React from 'react'

export default function SellersList() {
    return (
        <div className="rounded-lg border border-default-200">
            <div className="px-6 py-4 border-b border-b-default-200">
                <div className="flex flex-wrap justify-between items-center gap-6">
                    <h4 className="text-xl font-medium text-default-900">Sellers</h4>

                    <a href="admin/sellers/add" className="px-6 py-2.5 inline-flex text-white text-sm rounded-md bg-primary ">
                        <i data-lucide="plus" className="w-5 h-5 inline-flex align-middle me-2"></i>
                        Add a New Sellers
                    </a>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="relative lg:flex hidden">
                        <input type="search" className="ps-12 pe-4 py-2.5 block w-64 bg-default-50/0 text-default-600 border-default-200 rounded-lg text-sm ring-0 focus:border-primary focus:ring-primary" placeholder="Search..." />
                        <span className="absolute start-4 top-2.5">
                            <i data-lucide="search" className="w-5 h-5 text-default-600"></i>
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                        <div className="hs-dropdown relative inline-flex">
                            <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                Filter <i data-lucide="chevron-down" className="h-4 w-4"></i>
                            </button>

                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                <ul className="flex flex-col gap-1">
                                    <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">All</a></li>
                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Refund</a></li>
                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Paid</a></li>
                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Cancel</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="relative">
                            <span className="absolute top-1/2 start-2.5 -translate-y-1/2"><i data-lucide="calendar-days" className="h-4 w-4 text-default-700"></i></span>
                            <span className="absolute top-1/2 end-2.5 -translate-y-1/2"><i data-lucide="chevron-down" className="h-4 w-4 text-default-700"></i></span>
                            <input type="text" className="py-2.5 w-40 px-9 block bg-default-100 rounded-md border-0 text-sm text-default-700 font-medium focus:border-default-200 focus:ring-0" id="datepicker-basic" />
                        </div>

                        <div className="hs-dropdown relative inline-flex">
                            <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 xl:px-5 rounded-md bg-default-100 transition-all">
                                All Action <i data-lucide="chevron-down" className="h-4 w-4"></i>
                            </button>

                            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                <ul className="flex flex-col gap-1">
                                    <li><a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-100 rounded" href="javascript:void(0)">All</a></li>
                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Active</a></li>
                                    <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Block</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative overflow-x-auto border-t border-default-200">
                <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-default-200">
                            <thead className="bg-default-100">
                                <tr>
                                    <th scope="col" className="px-6 py-4 max-w-[1rem]">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-all" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-all" className="sr-only">Checkbox</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Customer Name</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Email</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Phone</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Orders</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Order Total</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Customer Since</th>
                                    <th scope="col" className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-default-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 rounded text-primary bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Paityn Herwitz</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">wlopez@outlook.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">739-813-1211</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">17</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹662.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Apr 02 2023 | <span className="text-xs">02:05:36</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Randy Siphron</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">lwhite@icloud.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">895-528-6760</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">03</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹448.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Jan 17 2023 | <span className="text-xs">06:35:32</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500">Block</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Livia Kenter</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">cbaker@hotmail.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">759-215-8839</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">07</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹941.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Dec 29 2020 | <span className="text-xs">13:09:57</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Ann Vetrovs</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">htaylor@aol.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">801-740-7902</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">06</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹133.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Dec 16 2016 | <span className="text-xs">20:14:39</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Roger Korsgaard</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">ksmith@yahoo.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">705-498-5991</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">02</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹824.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Aug 26 2023 | <span className="text-xs">10:34:09</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Ruben Calzoni</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">qdavis@mail.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">855-338-4990</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">13</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹238.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Jul 19 2023 | <span className="text-xs">16:48:10</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500">Block</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Talan Dokidis</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">rgarcia@hotmail.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">348-508-9895</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">14</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹679.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Sep 14 2021 | <span className="text-xs">20:24:37</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500">Block</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Carter George</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">bwhite@mail.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">422-949-1555</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">06</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹979.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Oct 09 2019 | <span className="text-xs">10:16:48</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Marilyn Stanton</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">ngeorge@aol.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">516-243-5018</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">15</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹959.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Oct 16 2023 | <span className="text-xs">03:49:38</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-500">Block</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center h-5">
                                            <input id="hs-table-search-checkbox-1" type="checkbox" className="form-checkbox h-5 w-5 border border-default-300 text-primary rounded bg-transparent focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200 focus:ring-opacity-50" />
                                            <label htmlFor="hs-table-search-checkbox-1" className="sr-only">Checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Emerson Dokidis</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">hscott@mail.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">575-541-4842</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">14</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">₹948.00</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">Apr 10 2018 | <span className="text-xs">13:51:30</span> </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

