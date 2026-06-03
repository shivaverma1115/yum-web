"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { useCart } from "@/context-api/cart-context";
import { formatCurrency } from "@/lib/constants";

export default function Cart() {
  const { items, subtotal, removeItem, setItemQuantity, clearCart } = useCart();

  const total = subtotal;

  if (items.length === 0) {
    return (
      <section className="lg:py-10 py-6">
        <div className="container text-center py-16">
          <h4 className="text-xl font-semibold text-default-800 mb-2">
            Your cart is empty
          </h4>
          <p className="text-sm text-default-500 mb-6">
            Add products from the shop to see them here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-500"
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:py-10 py-6">
      <div className="container">
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
          <div className="lg:col-span-2 col-span-1">
            <div className="border border-default-200 rounded-lg">
              <div className="border-b border-default-200 px-6 py-5">
                <h4 className="text-lg font-medium text-default-800">
                  Shopping Cart
                </h4>
              </div>

              <div className="flex flex-col overflow-hidden">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-default-200">
                        <thead className="bg-default-400/10">
                          <tr>
                            <th
                              scope="col"
                              className="min-w-[14rem] px-5 py-3 text-start text-xs font-medium text-default-500 uppercase"
                            >
                              Products
                            </th>
                            <th
                              scope="col"
                              className="px-5 py-3 text-start text-xs font-medium text-default-500 uppercase"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-5 py-3 text-start text-xs font-medium text-default-500 uppercase"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-5 py-3 text-center text-xs font-medium text-default-500 uppercase"
                            >
                              Sub-Total
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-default-200">
                          {items.map((item) => (
                            <tr key={item.productId}>
                              <td className="px-5 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.productId)}
                                    aria-label={`Remove ${item.name}`}
                                  >
                                    <XCircle className="w-5 h-5 text-default-400 hover:text-red-500" />
                                  </button>
                                  <img
                                    src={item.image_url ?? "/images/dishes/pizza.png"}
                                    alt={item.name}
                                    className="h-18 w-18 object-cover rounded"
                                  />
                                  <Link
                                    href={`/products/${item.productId}`}
                                    className="text-sm font-medium text-default-800 hover:text-primary"
                                  >
                                    {item.name}
                                  </Link>
                                </div>
                              </td>
                              <td className="px-5 py-3 whitespace-nowrap text-sm text-default-800">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-5 py-3 whitespace-nowrap">
                                <div className="inline-flex justify-between border border-default-200 p-1 rounded-full">
                                  <button
                                    type="button"
                                    className="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center"
                                    onClick={() =>
                                      setItemQuantity(
                                        item.productId,
                                        item.quantity - 1,
                                      )
                                    }
                                  >
                                    –
                                  </button>
                                  <input
                                    type="text"
                                    readOnly
                                    value={item.quantity}
                                    className="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent"
                                  />
                                  <button
                                    type="button"
                                    className="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center disabled:opacity-50"
                                    disabled={item.quantity >= item.maxQuantity}
                                    onClick={() =>
                                      setItemQuantity(
                                        item.productId,
                                        item.quantity + 1,
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3 whitespace-nowrap text-sm text-center text-default-800">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-default-200 px-6 py-5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-center text-sm font-medium shadow-sm transition-all duration-500"
                  >
                    Return to Shop
                  </Link>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center justify-center rounded-full border border-default-300 text-default-700 hover:bg-default-100 px-6 py-3 text-center text-sm font-medium transition-all duration-500"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border border-default-200 rounded-lg p-5 mb-5">
              <h4 className="text-lg font-semibold text-default-800 mb-5">
                Cart Totals
              </h4>
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <p className="text-sm text-default-500">Sub-total</p>
                  <p className="text-sm text-default-700 font-medium">
                    {formatCurrency(subtotal)}
                  </p>
                </div>

                <div className="flex justify-between mb-3">
                  <p className="text-sm text-default-500">Delivery</p>
                  <p className="text-sm text-default-700 font-medium">Free</p>
                </div>

                <div className="border-b border-default-200 my-4" />
                <div className="flex justify-between mb-3">
                  <p className="text-base text-default-700">Total</p>
                  <p className="text-base text-default-700 font-medium">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="border border-default-200 rounded-lg">
              <div className="px-6 py-5 border-b border-default-200">
                <h4 className="text-lg font-semibold text-default-800">
                  Coupon Code
                </h4>
              </div>

              <div className="p-6">
                <input
                  className="block w-full bg-transparent rounded-full py-2.5 px-4 border border-default-200"
                  type="text"
                  placeholder="Enter Coupon Code"
                />

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500"
                  >
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
