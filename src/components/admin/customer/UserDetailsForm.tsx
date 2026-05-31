import React from 'react'

export default function UserDetailsForm() {
    return (
        <div className="border rounded-lg border-default-200">
            <div className="p-6">
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
                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="user_name">User Name</label>
                        <input id="user_name" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="text" placeholder="Enter Your User Name" />
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
                        <select id="country" defaultValue="United States" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50">
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

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="description">Description</label>
                        <textarea id="description" className="block w-full bg-transparent rounded-lg py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200" rows={5} placeholder="Enter Your Last Name"></textarea>
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
    )
}

