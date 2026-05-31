import React from 'react'

export default function AdminProductAddPage() {
    return (
        <div>
            <div className="w-full lg:ps-64">
                <div className="p-6 page-content">

                    {/* {{> admin - page - title subtitle="Products" title="Products Add"}} */}

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="p-6 rounded-lg border border-default-200">
                            <div className="h-96 p-6 flex flex-col items-center justify-center rounded-lg border border-default-200 mb-4">
                                <div className="mb-4">
                                    <i data-lucide="image" className="w-10 h-10 stroke-primary fill-primary/10"></i>
                                </div>

                                <h5 className="text-base text-primary font-medium mb-2">
                                    <i data-lucide="upload-cloud" className="inline-flex ms-2"></i>
                                    Upload Image
                                </h5>

                                <p className="text-sm text-default-600 mb-2">Upload a cover image for your product.</p>
                                <p className="text-sm text-default-600">
                                    File Format
                                    <span className="text-default-800">jpeg, png</span>
                                    Recommened Size
                                    <span className="text-default-800">600x600 (1:1)</span>
                                </p>
                            </div>

                            <h4 className="text-base font-medium text-default-800 mb-4">Additional Images</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="h-40 p-6 flex flex-col items-center justify-center rounded-lg border border-default-200">
                                    <div className="mb-4">
                                        <i data-lucide="image" className="w-10 h-10 stroke-primary fill-primary/10"></i>
                                    </div>

                                    <h5 className="text-base text-primary font-medium text-center">
                                        <i data-lucide="upload-cloud" className="inline-flex ms-2"></i>
                                        Upload Image
                                    </h5>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="p-6 rounded-lg border border-default-200">
                                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-6">
                                        <div>
                                            <input className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Product Name" />
                                        </div>

                                        <div>
                                            <select defaultValue="" className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                                <option value="">Select Product Category</option>
                                                <option value="italian">Italian</option>
                                                <option value="bbq">BBQ</option>
                                                <option value="mexican">Mexican</option>
                                            </select>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-6">
                                            <div>
                                                <input className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Selling Price" />
                                            </div>

                                            <div>
                                                <input className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Cost Price" />
                                            </div>
                                        </div>

                                        <div>
                                            <input className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="number" placeholder="Quantity in Stock" />
                                        </div>

                                        <div>
                                            <select defaultValue="delivery" className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                                <option value="">Order Type</option>
                                                <option value="delivery">Delivery</option>
                                                <option value="pickup">Pickup</option>
                                                <option value="dine-in">Dine-in</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium text-default-600">Discount</h4>
                                            <div className="flex items-center gap-4">
                                                <label className="block text-sm text-default-600" htmlFor="addDiscount">Add Discount</label>
                                                <input type="checkbox" id="addDiscount" className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200" />
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium text-default-600">Expiry Date</h4>
                                            <div className="flex items-center gap-4">
                                                <label className="block text-sm text-default-600" htmlFor="addExpiryDate">Add Expiry Date</label>
                                                <input type="checkbox" id="addExpiryDate" className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <textarea className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" rows={5} placeholder="Short Description"></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="editor">Product Long Description</label>
                                            <div id="editor" className="h-36 mb-2">
                                                <h3>Your text goes here</h3>
                                            </div>

                                            <p className="text-sm text-default-600">Add a long description for your product</p>
                                        </div>

                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium text-default-600">Return Policy</h4>
                                            <div className="flex items-center gap-4">
                                                <label className="block text-sm text-default-600" htmlFor="returnPolicy">Return Policy</label>
                                                <input type="checkbox" id="returnPolicy" className="relative w-[3.25rem] h-7 bg-default-200 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200" />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-default-500 mb-3">Date Added</p>
                                            <div className="grid lg:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 start-2.5 -translate-y-1/2"><i data-lucide="calendar-days" className="h-4 w-4 text-default-700"></i></span>
                                                        <span className="absolute top-1/2 end-2.5 -translate-y-1/2"><i data-lucide="chevron-down" className="h-4 w-4 text-default-700"></i></span>
                                                        <input type="text" className="py-2.5 w-full px-9 block bg-default-100 rounded-md border-0 text-sm text-default-700 font-medium focus:border-default-200 focus:ring-0" id="datepicker-basic" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 start-2.5 -translate-y-1/2"><i data-lucide="calendar-days" className="h-4 w-4 text-default-700"></i></span>
                                                        <span className="absolute top-1/2 end-2.5 -translate-y-1/2"><i data-lucide="chevron-down" className="h-4 w-4 text-default-700"></i></span>
                                                        <input type="text" className="py-2.5 w-full px-9 block bg-default-100 rounded-md border-0 text-sm text-default-700 font-medium focus:border-default-200 focus:ring-0" id="timepicker" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="flex flex-wrap justify-end items-center gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                        <button type="button" className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-700 text-sm py-2.5 px-4 rounded-md bg-default-100 transition-all">
                                            Save as Draft <i data-lucide="chevron-down" className="h-4 w-4"></i>
                                        </button>

                                        <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                            <ul className="flex flex-col gap-1">
                                                <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Publish</a></li>
                                                <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Save as Darft</a></li>
                                                <li><a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-100 rounded" href="javascript:void(0)">Discard</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button className="py-2.5 px-4 inline-flex rounded-lg text-sm font-medium bg-primary text-white transition-all hover:bg-primary-500">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

