import React from 'react'

export default function CartPage() {
    return (
        <div>
            <section className="lg:py-10 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="lg:col-span-2 col-span-1">
                            <div className="border border-default-200 rounded-lg">
                                <div className="border-b border-default-200 px-6 py-5">
                                    <h4 className="text-lg font-medium text-default-800">Shopping Cart</h4>
                                </div>

                                <div className="flex flex-col overflow-hidden">
                                    <div className="-m-1.5 overflow-x-auto">
                                        <div className="p-1.5 min-w-full inline-block align-middle">
                                            <div className="overflow-hidden">
                                                <table className="min-w-full divide-y divide-default-200">
                                                    <thead className="bg-default-400/10">
                                                        <tr>
                                                            <th scope="col" className="min-w-[14rem] px-5 py-3 text-start text-xs font-medium text-default-500 uppercase">Products</th>
                                                            <th scope="col" className="px-5 py-3 text-start text-xs font-medium text-default-500 uppercase">Price</th>
                                                            <th scope="col" className="px-5 py-3 text-start text-xs font-medium text-default-500 uppercase">Quantity</th>
                                                            <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-default-500 uppercase">Sub-Total</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="divide-y divide-default-200">
                                                        <tr>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <button><i data-lucide="x-circle" className="w-5 h-5 text-default-400"></i></button>
                                                                    <img src="/images/dishes/onion-rings.png" className="h-18 w-18" />
                                                                    <h4 className="text-sm font-medium text-default-800">Onion Rings</h4>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-default-800">$29</td>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="inline-flex justify-between border border-default-200 p-1 rounded-full">
                                                                    <button type="button" className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">–</button>
                                                                    <input type="text" className="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" value="1" min="0" max="100" readOnly />
                                                                    <button type="button" className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">+</button>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-center text-default-800">$50</td>
                                                        </tr>

                                                        <tr>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <button><i data-lucide="x-circle" className="w-5 h-5 text-default-400"></i></button>
                                                                    <img src="/images/dishes/burrito-bowl.png" className="h-18 w-18" />
                                                                    <h4 className="text-sm font-medium text-default-800">Burrito Bowl</h4>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-default-800">$50</td>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="inline-flex justify-between border border-default-200 p-1 rounded-full">
                                                                    <button type="button" className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">–</button>
                                                                    <input type="text" className="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" value="3" min="0" max="100" readOnly />
                                                                    <button type="button" className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">+</button>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-center text-default-800">$150</td>
                                                        </tr>

                                                        <tr>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <button><i data-lucide="x-circle" className="w-5 h-5 text-default-400"></i></button>
                                                                    <img src="/images/dishes/garlic-herb-bread.png" className="h-18 w-18" />
                                                                    <h4 className="text-sm font-medium text-default-800">Garlic & Herb Bread</h4>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-default-800">$42</td>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="inline-flex justify-between border border-default-200 p-1 rounded-full">
                                                                    <button type="button" className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">–</button>
                                                                    <input type="text" className="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" value="2" min="0" max="100" readOnly />
                                                                    <button type="button" className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">+</button>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-center text-default-800">$84</td>
                                                        </tr>

                                                        <tr>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <button><i data-lucide="x-circle" className="w-5 h-5 text-default-400"></i></button>
                                                                    <img src="/images/dishes/red-velvet-pastry.png" className="h-18 w-18" />
                                                                    <h4 className="text-sm font-medium text-default-800">Red Velvet Pastry</h4>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-default-800">$68</td>
                                                            <td className="px-5 py-3 whitespace-nowrap">
                                                                <div className="inline-flex justify-between border border-default-200 p-1 rounded-full">
                                                                    <button type="button" className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">–</button>
                                                                    <input type="text" className="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" value="1" min="0" max="100" readOnly />
                                                                    <button type="button" className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center">+</button>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-center text-default-800">$68</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-default-200 px-6 py-5">
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <button className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-center text-sm font-medium shadow-sm transition-all duration-500">
                                            Return to Shop
                                        </button>

                                        <button className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-center text-sm font-medium shadow-sm transition-all duration-500">
                                            Update Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="border border-default-200 rounded-lg p-5 mb-5">
                                <h4 className="text-lg font-semibold text-default-800 mb-5">Cart Totals</h4>
                                <div className="mb-6">
                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Sub-total</p>
                                        <p className="text-sm text-default-700 font-medium">$320</p>
                                    </div>

                                    <div className="flex justify-between mb-3">
                                        <p className="text-sm text-default-500">Delivery</p>
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

                                <a href="checkout" className="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500">Proceed to Checkout</a>
                            </div>

                            <div className="border border-default-200 rounded-lg">
                                <div className="px-6 py-5 border-b border-default-200">
                                    <h4 className="text-lg font-semibold text-default-800">Coupon Code</h4>
                                </div>

                                <div className="p-6">
                                    <input id="LoggingEmailAddress" className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200" type="text" placeholder="Enter Coupon Code" />

                                    <div className="flex justify-end mt-4">
                                        <button className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500">Apply Coupon</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

