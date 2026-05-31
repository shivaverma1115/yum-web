import React from 'react'

export default function RestaurantAddPage() {
    return (
        <div>
            <div className="w-full lg:ps-64">
                <div className="p-6 page-content">

                    {/* {{> admin - page - title subtitle="Restaurant" title="Restaurant Add"}} */}

                    <div>
                        <nav className="flex flex-wrap justify-center gap-4 mb-6" aria-label="Tabs" role="tablist">
                            <button type="button" className="hs-tab-active:bg-primary hs-tab-active:text-white py-3 px-20 inline-flex bg-primary/10 text-sm font-medium text-center text-primary rounded-full active" data-hs-tab="#tabBusinessDetail" aria-controls="tabBusinessDetail" role="tab">
                                Business Detail
                            </button>

                            <button type="button" className="hs-tab-active:bg-primary hs-tab-active:text-white py-3 px-20 inline-flex bg-primary/10 text-sm font-medium text-center text-primary rounded-full" data-hs-tab="#tabPersonalDetail" aria-controls="tabPersonalDetail" role="tab">
                                Personal Detail
                            </button>

                            <button type="button" className="hs-tab-active:bg-primary hs-tab-active:text-white py-3 px-20 inline-flex bg-primary/10 text-sm font-medium text-center text-primary rounded-full" data-hs-tab="#tabBankDetail" aria-controls="tabBankDetail" role="tab">
                                Bank Detail
                            </button>
                        </nav>

                        <div className="p-6 border rounded-lg border-default-200">
                            <div id="tabBusinessDetail" role="tabpanel">
                                <h4 className="text-lg font-medium text-default-900 mb-6">Step 1:</h4>

                                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="firstName">First Name</label>
                                        <input id="firstName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your First Name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="lastName">Last Name</label>
                                        <input id="lastName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Last Name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="contactNumber">Contact Number</label>
                                        <input id="contactNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Contact Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="phoneNumber">Phone Number</label>
                                        <input id="phoneNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Phone Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="emailAddress">Email</label>
                                        <input id="emailAddress" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Email" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="birthofDate">Birth of Date</label>
                                        <input id="birthofDate" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Birth of Date" />
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="city">City</label>
                                        <input id="city" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your City" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="country">Country</label>
                                        <input id="country" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Country" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="zipCode">Zip Code</label>
                                        <input id="zipCode" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Zip Code" />
                                    </div>

                                    <div className="lg:col-span-3">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="description">Description</label>
                                        <textarea id="description" className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200" rows={5} placeholder="Enter Description"></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white">
                                        <i data-lucide="x" className="w-5 h-5"></i>
                                        Close
                                    </button>

                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500">
                                        <i data-lucide="save" className="w-5 h-5"></i>
                                        Save
                                    </button>
                                </div>
                            </div>

                            <div id="tabPersonalDetail" className="hidden" role="tabpanel">
                                <h4 className="text-lg font-medium text-default-900 mb-6">Step 2:</h4>

                                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="companyName">Company Name</label>
                                        <input id="companyName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Company Name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="companyType">Company Type</label>
                                        <input id="companyType" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Company Type" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="panCardNumber">PAN Card Number</label>
                                        <input id="panCardNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter PAN Card Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="faxNumber">Fax Number</label>
                                        <input id="faxNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Fax Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="website">Website</label>
                                        <input id="website" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter website.com" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="exercitation">Email</label>
                                        <input id="exercitation" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Email" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="companyNumber">Number</label>
                                        <input id="companyNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="companyLogo">Company Logo</label>
                                        <input type="file" name="companyLogo" id="file-input" className="block w-full bg-transparent border border-default-200 rounded-full focus:ring-transparent focus:outline-none focus:border-default-200 file:border-0 file:bg-default-100 file:me-4 file:py-2.5 file:px-4" placeholder="Upload Your Company Logo" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white">
                                        <i data-lucide="x" className="w-5 h-5"></i>
                                        Close
                                    </button>

                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500">
                                        <i data-lucide="save" className="w-5 h-5"></i>
                                        Save
                                    </button>
                                </div>
                            </div>

                            <div id="tabBankDetail" className="hidden" role="tabpanel">
                                <h4 className="text-lg font-medium text-default-900 mb-6">Step 3:</h4>

                                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="bankName">Bank Name</label>
                                        <input id="bankName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Bank Name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="bankBranch">Branch</label>
                                        <input id="bankBranch" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Branch" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="accountHolderName">Account Holder Name</label>
                                        <input id="accountHolderName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Account Holder Name" />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="accountNumber">Account Number</label>
                                        <input id="accountNumber" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Account Number" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="IFSCCode">IFSC Code</label>
                                        <input id="IFSCCode" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter IFSC Code" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white">
                                        <i data-lucide="x" className="w-5 h-5"></i>
                                        Close
                                    </button>

                                    <button className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500">
                                        <i data-lucide="save" className="w-5 h-5"></i>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

