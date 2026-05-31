import React from 'react'

export default function page() {
    return (
        <div>
            <section className="lg:py-10 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="lg:col-span-2 col-span-1">
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-default-800 mb-6">Billing Information</h4>

                                <div className="grid lg:grid-cols-4 gap-6">
                                    <div>
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">User name</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="First Name" />
                                    </div>

                                    <div>
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">&nbsp;</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Last name" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Company Name <span className="text-default-500">(Optional)</span> </label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Company Name" />
                                    </div>

                                    <div className="lg:col-span-4">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Address </label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Enter your address" />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm text-default-700 mb-2">Country</label>
                                        <select id="country" defaultValue="United States" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200">
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
                                        <label htmlFor="state" className="block text-sm text-default-700 mb-2">Region/State</label>
                                        <select id="state" defaultValue="Alabama" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200">
                                            <option value="Alabama">Alabama</option>
                                            <option value="Alaska">Alaska</option>
                                            <option value="Arizona">Arizona</option>
                                            <option value="Arkansas">Arkansas</option>
                                            <option value="California">California</option>
                                            <option value="Colorado">Colorado</option>
                                            <option value="Connecticut">Connecticut</option>
                                            <option value="Delaware">Delaware</option>
                                            <option value="Florida">Florida</option>
                                            <option value="Indiana">Indiana</option>
                                            <option value="Iowa">Iowa</option>
                                            <option value="Kansas">Kansas</option>
                                            <option value="Kentucky">Kentucky</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm text-default-700 mb-2">City</label>
                                        <select id="city" defaultValue="Alexander" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200">
                                            <option value="Alexander">Alexander City</option>
                                            <option value="Andalusia">Andalusia</option>
                                            <option value="Anniston">Anniston</option>
                                            <option value="Athens">Athens</option>
                                            <option value="Atmore">Atmore</option>
                                            <option value="Auburn">Auburn</option>
                                            <option value="Chickasaw">Chickasaw</option>
                                            <option value="Clanton">Clanton</option>
                                            <option value="Demopolis">Demopolis</option>
                                            <option value="Guntersville">Guntersville</option>
                                            <option value="Huntsville">Huntsville</option>
                                            <option value="Jasper">Jasper</option>
                                            <option value="Marion">Marion</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Zip Code</label>
                                        <select name="" id="" defaultValue="35010" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200 focus:ring-transparent focus:border-default-200" >
                                            <option value="35010">35010</option>
                                            <option value="35011">35011</option>
                                            <option value="35012">35012</option>
                                            <option value="35013">35013</option>
                                            <option value="35014">35014</option>
                                        </select>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Email </label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="example@example.com" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Phone Number </label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="+1  123-XXX-7890" />
                                    </div>

                                    <div className="flex items-center">
                                        <input id="shipmentAddress" className="text-primary w-5 h-5 rounded border-default-200 focus:ring-0 bg-transparent" type="checkbox" placeholder="+1  123-XXX-7890" defaultChecked />
                                        <label htmlFor="shipmentAddress" className="block text-sm text-default-700 ms-2">Ship into different address </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-default-800 mb-6">Payment Option</h4>

                                <div className="border border-default-200 rounded-lg p-6 lg:w-5/6 mb-5">
                                    <div className="grid lg:grid-cols-4 grid-cols-2">
                                        <div className="text-center p-6">
                                            <label htmlFor="paymentCOD" className="flex flex-col items-center justify-center mb-4">
                                                <i data-lucide="dollar-sign" className="text-primary mb-4"></i>
                                                <h5 className="text-sm font-medium text-default-700">Cash on Delivery</h5>
                                            </label>
                                            <input id="paymentCOD" className="text-primary w-5 h-5 dark:bg-transparent border-default-200 focus:ring-0" type="radio" name="paymentOption" defaultChecked />
                                        </div>

                                        <div className="text-center p-6">
                                            <label htmlFor="paymentPaypal" className="flex flex-col items-center justify-center mb-4">
                                                <img src="/images/payment/paypal-2.svg" className="w-6 h-6 mb-4" />
                                                <h5 className="text-sm font-medium text-default-700">Paypal</h5>
                                            </label>
                                            <input id="paymentPaypal" className="text-primary w-5 h-5 dark:bg-transparent border-default-200 focus:ring-0" type="radio" name="paymentOption" />
                                        </div>

                                        <div className="text-center p-6">
                                            <label htmlFor="paymentAmazonPay" className="flex flex-col items-center justify-center mb-4">
                                                <img src="/images/payment/amazon.svg" className="w-6 h-6 mb-4" />
                                                <h5 className="text-sm font-medium text-default-700">Amazon Pay</h5>
                                            </label>
                                            <input id="paymentAmazonPay" className="text-primary w-5 h-5 dark:bg-transparent border-default-200 focus:ring-0" type="radio" name="paymentOption" />
                                        </div>

                                        <div className="text-center p-6">
                                            <label htmlFor="paymentCard" className="flex flex-col items-center justify-center mb-4">
                                                <i data-lucide="credit-card" className="text-primary mb-4"></i>
                                                <h5 className="text-sm font-medium text-default-700">Debid/Credit Card</h5>
                                            </label>
                                            <input id="paymentCard" className="text-primary w-5 h-5 dark:bg-transparent border-default-200 focus:ring-0" type="radio" name="paymentOption" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="lg:col-span-2">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Name on Card</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Enter card holder name" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Card Number</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Enter card number" />
                                    </div>

                                    <div>
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Expire Date</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="DD/YY" />
                                    </div>

                                    <div>
                                        <label htmlFor="userName" className="block text-sm text-default-700 mb-2">CVC</label>
                                        <input id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Enter CVV number" />
                                    </div>

                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-default-800 mb-6">Additional Information</h4>

                                <div>
                                    <label htmlFor="userName" className="block text-sm text-default-700 mb-2">Company Name <span className="text-default-500">(Optional)</span></label>
                                    <textarea id="userName" className="block w-full bg-transparent dark:bg-default-50 rounded-lg py-2.5 px-4 border border-default-200" rows={4} placeholder="Notes about your order, e.g. special notes for delivery"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="border border-default-200 rounded-lg p-5">
                                <h4 className="text-lg font-semibold text-default-700 mb-5">Order Summary</h4>
                                <div className="flex items-center mb-4">
                                    <img src="/images/dishes/onion-rings.png" className="h-20 w-20 me-2" />
                                    <div>
                                        <h4 className="text-sm text-default-600 mb-2">Onion Rings</h4>
                                        <h4 className="text-sm text-default-400">1 x <span className="text-primary font-semibold">$29</span></h4>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <img src="/images/dishes/burrito-bowl.png" className="h-20 w-20 me-2" />
                                    <div>
                                        <h4 className="text-sm text-default-600 mb-2">Burrito Bowl</h4>
                                        <h4 className="text-sm text-default-400">3 x <span className="text-primary font-semibold">$50</span></h4>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <img src="/images/dishes/garlic-herb-bread.png" className="h-20 w-20 me-2" />
                                    <div>
                                        <h4 className="text-sm text-default-600 mb-2">Garlic & Herb Bread</h4>
                                        <h4 className="text-sm text-default-400">2 x <span className="text-primary font-semibold">$42</span></h4>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <img src="/images/dishes/red-velvet-pastry.png" className="h-20 w-20 me-2" />
                                    <div>
                                        <h4 className="text-sm text-default-600 mb-2">Red Velvet Pastry</h4>
                                        <h4 className="text-sm text-default-400">1 x <span className="text-primary font-semibold">$68</span></h4>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Sub-total</p>
                                        <p className="text-sm text-default-700 font-medium">$320</p>
                                    </div>

                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Shipping</p>
                                        <p className="text-sm text-default-700 font-medium">Free</p>
                                    </div>

                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Discount</p>
                                        <p className="text-sm text-default-700 font-medium">$24</p>
                                    </div>

                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Tax</p>
                                        <p className="text-sm text-default-700 font-medium">$61.99</p>
                                    </div>

                                    <div className="border-b border-default-200 my-4"></div>
                                    <div className="flex justify-between mb-3">
                                        <p className="text-base text-default-700">Total</p>
                                        <p className="text-base text-default-700 font-medium">$357.99 USD</p>
                                    </div>
                                </div>
                                <button className="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500">Place Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

