import React from 'react'

export default function AdminSetting() {
    return (
        <div>
            <div className="p-6 border rounded-lg border-default-200 mb-6">
                <div>
                    <h4 className="text-xl font-medium text-default-900 mb-4">Personal Details</h4>

                    <div className="grid lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-1">
                            <div className="w-60 h-60 relative">
                                <img src="/images/avatars/avatar3.png" className="w-full h-full rounded-full" />
                                <div className="absolute bottom-2 end-4">
                                    <button className="w-11 h-11 flex items-center justify-center rounded-full bg-primary border-2 border-default-50">
                                        <i data-lucide="camera" className="w-5 h-5 text-white"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="firstName">First Name</label>
                                    <input id="firstName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your First Name" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="lastName">Last Name</label>
                                    <input id="lastName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Last Name" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="userName">User Name</label>
                                    <input id="userName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your User Name" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="emailAddress">Email</label>
                                    <input id="emailAddress" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="demoexample@mail.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="phone_number">Phone Number</label>
                                    <input id="phone_number" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="tel" placeholder="+1-123-XXX-4567" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="country">Country/Region</label>
                                    <select id="country" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" defaultValue="United States">
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="China">China</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Bharat">Bharat</option>
                                        <option value="Afghanistan">Afghanistan</option>
                                        <option value="France">France</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Albania">Albania</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="state">State</label>
                                    <select id="state" defaultValue="Alabama" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                        <option value="Alabama">Alabama</option>
                                        <option value="Alaska">Alaska</option>
                                        <option value="Arizona">Arizona</option>
                                        <option value="Arkansas">Arkansas</option>
                                        <option value="California">California</option>
                                        <option value="Colorado">Colorado</option>
                                        <option value="Connecticut">Connecticut</option>
                                        <option value="Delaware">Delaware</option>
                                        <option value="Florida">Florida</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Hawaii">Hawaii</option>
                                        <option value="Idaho">Idaho</option>
                                        <option value="Illinois">Illinois</option>
                                        <option value="Indiana">Indiana</option>
                                        <option value="Iowa">Iowa</option>
                                        <option value="Kansas">Kansas</option>
                                        <option value="Kentucky">Kentucky</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="zip_code">Zip Code</label>
                                    <input id="zip_code" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="35010" />
                                </div>

                                <div>
                                    <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg border-default-200 mb-6">
                <div>
                    <h4 className="text-xl font-medium text-default-900 mb-4">Change Password</h4>

                    <div className="mb-4" data-x-password>
                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="current_password">Current Password</label>
                        <div className="flex">
                            <input id="current_password" className="form-password block w-full rounded-s-full py-2.5 px-4 bg-transparent border border-default-200 focus:ring-transparent focus:border-default-200" type="password" placeholder="Enter your password" />
                            <button id="current_password" className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-transparent -ms-px border-default-200">
                                <i className="password-eye-on h-5 w-5 text-default-600" data-lucide="eye"></i>
                                <i className="password-eye-off h-5 w-5 text-default-600" data-lucide="eye-off"></i>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4" data-x-password>
                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="new_password">New Password</label>
                        <div className="flex">
                            <input id="new_password" className="form-password block w-full rounded-s-full py-2.5 px-4 bg-transparent border border-default-200 focus:ring-transparent focus:border-default-200" type="password" placeholder="Enter your password" />
                            <button id="new_password" className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-transparent -ms-px border-default-200">
                                <i className="password-eye-on h-5 w-5 text-default-600" data-lucide="eye"></i>
                                <i className="password-eye-off h-5 w-5 text-default-600" data-lucide="eye-off"></i>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4" data-x-password>
                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="confirm_password">Confirm Password</label>
                        <div className="flex">
                            <input id="confirm_password" className="form-password block w-full rounded-s-full py-2.5 px-4 bg-transparent border border-default-200 focus:ring-transparent focus:border-default-200" type="password" placeholder="Enter your password" />
                            <button id="confirm_password" className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-transparent -ms-px border-default-200">
                                <i className="password-eye-on h-5 w-5 text-default-600" data-lucide="eye"></i>
                                <i className="password-eye-off h-5 w-5 text-default-600" data-lucide="eye-off"></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Save Changes</button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg border-default-200">
                    <h4 className="text-xl font-medium text-default-900 mb-6">Billing Address</h4>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billingFirstName">First Name</label>
                            <input id="billingFirstName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your First Name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billingLastName">Last Name</label>
                            <input id="billingLastName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Last Name" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billingCompanyName">Company Name (Optional)</label>
                            <input id="billingCompanyName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Label" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billingAddress">Address</label>
                            <input id="billingAddress" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Road No. 47/x, House no. 123/B, Flat No. B4" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billingCountry">Country/Region</label>
                            <select id="billingCountry" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" defaultValue="United States">
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="China">China</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Bharat">Bharat</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="France">France</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Albania">Albania</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billing_state">State</label>
                            <select id="billing_state" defaultValue="Alabama" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billing_city">City</label>
                            <select id="billing_city" defaultValue="Alexander" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                <option value="Alexander">Alexander City</option>
                                <option value="Andalusia">Andalusia</option>
                                <option value="Anniston">Anniston</option>
                                <option value="Athens">Athens</option>
                                <option value="Atmore">Atmore</option>
                                <option value="Auburn">Auburn</option>
                                <option value="Bessemer">Bessemer</option>
                                <option value="Birmingham">Birmingham</option>
                                <option value="Chickasaw">Chickasaw</option>
                                <option value="Clanton">Clanton</option>
                                <option value="Cullman">Cullman</option>
                                <option value="Decatur">Decatur</option>
                                <option value="Demopolis">Demopolis</option>
                                <option value="Dothan">Dothan</option>
                                <option value="Enterprise">Enterprise</option>
                                <option value="Eufaula">Eufaula</option>
                                <option value="Florence">Florence</option>
                                <option value="Fort Payne">Fort Payne</option>
                                <option value="Gadsden">Gadsden</option>
                                <option value="Greenville">Greenville</option>
                                <option value="Guntersville">Guntersville</option>
                                <option value="Huntsville">Huntsville</option>
                                <option value="Jasper">Jasper</option>
                                <option value="Marion">Marion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billing_zip_code">Zip Code</label>
                            <input id="billing_zip_code" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="35010" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billing_e_mail">Email</label>
                            <input id="billing_e_mail" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="demoexample@mail.com" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="billing_phone_number">Phone Number</label>
                            <input id="billing_phone_number" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="tel" placeholder="+1-123-XXX-4567" />
                        </div>

                        <div>
                            <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Save Changes</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border rounded-lg border-default-200">
                    <h4 className="text-xl font-medium text-default-900 mb-6">Shipping Address</h4>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shippingFirstName">First Name</label>
                            <input id="shippingFirstName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your First Name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shippingLastName">Last Name</label>
                            <input id="shippingLastName" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your Last Name" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_company_name">Company Name (Optional)</label>
                            <input id="shipping_company_name" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Label" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_address">Address</label>
                            <input id="shipping_address" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Road No. 47/x, House no. 123/B, Flat No. B4" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_country">Country/Region</label>
                            <select id="shipping_country" defaultValue="United States" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="China">China</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Bharat">Bharat</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="France">France</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Albania">Albania</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_state">State</label>
                            <select id="shipping_state" defaultValue="Alabama" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_city">City</label>
                            <select id="shipping_city" defaultValue="Alexander" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
                                <option value="Alexander">Alexander City</option>
                                <option value="Andalusia">Andalusia</option>
                                <option value="Anniston">Anniston</option>
                                <option value="Athens">Athens</option>
                                <option value="Atmore">Atmore</option>
                                <option value="Auburn">Auburn</option>
                                <option value="Bessemer">Bessemer</option>
                                <option value="Birmingham">Birmingham</option>
                                <option value="Chickasaw">Chickasaw</option>
                                <option value="Clanton">Clanton</option>
                                <option value="Cullman">Cullman</option>
                                <option value="Decatur">Decatur</option>
                                <option value="Demopolis">Demopolis</option>
                                <option value="Dothan">Dothan</option>
                                <option value="Enterprise">Enterprise</option>
                                <option value="Eufaula">Eufaula</option>
                                <option value="Florence">Florence</option>
                                <option value="Fort Payne">Fort Payne</option>
                                <option value="Gadsden">Gadsden</option>
                                <option value="Greenville">Greenville</option>
                                <option value="Guntersville">Guntersville</option>
                                <option value="Huntsville">Huntsville</option>
                                <option value="Jasper">Jasper</option>
                                <option value="Marion">Marion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_zip_code">Zip Code</label>
                            <input id="shipping_zip_code" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="35010" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_e_mail">Email</label>
                            <input id="shipping_e_mail" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="demoexample@mail.com" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="shipping_phone_number">Phone Number</label>
                            <input id="shipping_phone_number" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="tel" placeholder="+1-123-XXX-4567" />
                        </div>

                        <div>
                            <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

