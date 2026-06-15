import Link from 'next/link'
import React from 'react'

export default function AdminWallet() {
    return (
        <div className="grid xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <div className="border border-default-200 rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-default-800 mb-6">Card Details</h3>
                                <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-6 gap-y-10">
                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="relative">
                                            <div className="swiper card-wallet !mb-6 md:!mx-6">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide">
                                                        <div className="rounded-lg overflow-hidden bg-cover bg-right-bottom bg-no-repeat bg-indigo-600/80" style={{ backgroundImage: "url('/images/payment/wallate-card-bg.png')" }}>
                                                            <div className="p-6">
                                                                <div className="mb-8">
                                                                    <div className="h-11 w-16 overflow-hidden">
                                                                        <img src="/images/payment/visa.svg" className="max-w-full h-full" />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-6">
                                                                    <div className="flex items-center justify-between mb-9">
                                                                        <div className="flex items-end h-8">
                                                                            <img src="/images/payment/card-chip.png" className="max-w-full h-full" />
                                                                        </div>

                                                                        <div className="flex gap-4">
                                                                            <span className="text-xl text-white font-semibold font-sans tracking-widest">0123</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">2345</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">4567</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">6789</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Card Holder</p>
                                                                        <h3 className="text-lg font-semibold text-white uppercase">Kierra Madsen</h3>
                                                                    </div>

                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Expire Date</p>
                                                                        <h3 className="text-lg font-semibold text-white">10/28</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="swiper-slide">
                                                        <div className="rounded-lg overflow-hidden bg-cover bg-right-bottom bg-no-repeat bg-red-600/80" style={{ backgroundImage: "url('/images/payment/wallate-card-bg.png')" }}>
                                                            <div className="p-6">
                                                                <div className="mb-8">
                                                                    <div className="h-11 w-16 overflow-hidden">
                                                                        <img src="/images/payment/master.svg" className="max-w-full h-full" />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-6">
                                                                    <div className="flex items-center justify-between mb-9">
                                                                        <div className="flex items-end h-8">
                                                                            <img src="/images/payment/card-chip.png" className="max-w-full h-full" />
                                                                        </div>

                                                                        <div className="flex gap-4">
                                                                            <span className="text-xl text-white font-semibold font-sans tracking-widest">0123</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">2345</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">4567</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">6789</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Card Holder</p>
                                                                        <h3 className="text-lg font-semibold text-white uppercase">Kierra Madsen</h3>
                                                                    </div>

                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Expire Date</p>
                                                                        <h3 className="text-lg font-semibold text-white">10/28</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="swiper-slide">
                                                        <div className="rounded-lg overflow-hidden bg-cover bg-right-bottom bg-no-repeat bg-primary/80" style={{ backgroundImage: "url('/images/payment/wallate-card-bg.png')" }}>
                                                            <div className="p-6">
                                                                <div className="mb-8">
                                                                    <div className="h-11 w-16 overflow-hidden">
                                                                        <img src="/images/payment/rupay.svg" className="max-w-full h-full" />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-6">
                                                                    <div className="flex items-center justify-between mb-9">
                                                                        <div className="flex items-end h-8">
                                                                            <img src="/images/payment/card-chip.png" className="max-w-full h-full" />
                                                                        </div>

                                                                        <div className="flex gap-4">
                                                                            <span className="text-xl text-white font-semibold font-sans tracking-widest">0123</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">2345</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">4567</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">6789</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Card Holder</p>
                                                                        <h3 className="text-lg font-semibold text-white uppercase">Kierra Madsen</h3>
                                                                    </div>

                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Expire Date</p>
                                                                        <h3 className="text-lg font-semibold text-white">10/28</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="swiper-slide">
                                                        <div className="rounded-lg overflow-hidden bg-cover bg-right-bottom bg-no-repeat bg-default-600/80" style={{ backgroundImage: "url('/images/payment/wallate-card-bg.png')" }}>
                                                            <div className="p-6">
                                                                <div className="mb-8">
                                                                    <div className="h-11 w-16 overflow-hidden">
                                                                        <img src="/images/payment/paypal.svg" className="max-w-full h-full" />
                                                                    </div>
                                                                </div>

                                                                <div className="mb-6">
                                                                    <div className="flex items-center justify-between mb-9">
                                                                        <div className="flex items-end h-8">
                                                                            <img src="/images/payment/card-chip.png" className="max-w-full h-full" />
                                                                        </div>

                                                                        <div className="flex gap-4">
                                                                            <span className="text-xl text-white font-semibold font-sans tracking-widest">0123</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">2345</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">4567</span> <span className="text-xl text-white font-semibold font-sans tracking-widest">6789</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Card Holder</p>
                                                                        <h3 className="text-lg font-semibold text-white uppercase">Kierra Madsen</h3>
                                                                    </div>

                                                                    <div className="w-1/2">
                                                                        <p className="text-base text-white mb-0.5">Expire Date</p>
                                                                        <h3 className="text-lg font-semibold text-white">10/28</h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:flex hidden items-center gap-1 w-full ">
                                                <div className="card-button-prev cursor-pointer after:content-[] absolute top-1/2 -translate-y-1/2 start-0 text-default-700">
                                                    <i className="iconify fa7-solid--angle-left text-xl"></i>
                                                </div>

                                                <div className="card-button-next cursor-pointer after:content-[] absolute top-1/2 -translate-y-1/2 end-0 text-default-700">
                                                    <i className="iconify fa7-solid--angle-right text-xl"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6">
                                            <div className="space-y-2">
                                                <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-default-200">
                                                    <div className="w-[35%] flex h-full items-center justify-center bg-primary rounded-full text-white" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}></div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 items-center justify-between">
                                                    <div className="font-medium text-default-400">Weekly payment limit</div>
                                                    <div className="text-sm font-medium text-default-950"><span className="text-default-400">$11200.10</span> / $4000</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1 border-s-0 border-default-200 border-b lg:border-b-0 lg:border-s">
                                        <div className="pt-10 lg:pt-0 lg:ps-10 lg:text-end text-start">
                                            <h1 className="text-2xl font-semibold text-primary">$2850.75</h1>
                                            <p className="text-base mb-6">Current Balance</p>

                                            <h2 className="text-xl text-green-500 font-semibold">$4595.50</h2>
                                            <p className="text-base mb-6">Income</p>

                                            <h2 className="text-lg text-red-500 font-semibold mb-1">$412.40</h2>
                                            <p className="text-base mb-6">Outgoing</p>

                                            <div className="mb-4">
                                                <input type="checkbox" id="hs-basic-usage" className="relative w-[3.25rem] h-7 bg-default-200 ring-0 focus:outline-0 focus:ring-0 checked:bg-none checked:!bg-primary border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 appearance-none focus:ring-transparent before:inline-block before:w-6 before:h-6 before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:transition before:ease-in-out before:duration-200" />
                                                <label htmlFor="hs-basic-usage" className="sr-only">switch</label>
                                            </div>
                                            <p className="text-base">Deacivate card</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <div className="border border-default-200 rounded-lg">
                                <div className="p-6">
                                    <p className="text-base font-medium text-default-600 mb-6">Earning Amount</p>
                                    <h3 className="text-2xl font-semibold text-default-900 mb-6">$23,568.00</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-500/20 text-green-500">
                                            <i data-lucide="trending-up" className="h-5 w-5"></i>
                                        </span>
                                        <span className="text-lg text-default-500 font-medium">23%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-default-200 rounded-lg">
                                <div className="p-6">
                                    <p className="text-base font-medium text-default-600 mb-6">Earning Amount</p>
                                    <h3 className="text-2xl font-semibold text-default-900 mb-6">$5,631.50</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-500/20 text-red-500">
                                            <i data-lucide="trending-down" className="h-5 w-5"></i>
                                        </span>
                                        <span className="text-lg text-default-500 font-medium">05%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <div className="border rounded-lg overflow-hidden border-default-200">
                        <h2 className="text-lg text-default-800 font-semibold px-6 py-4">Transaction history</h2>

                        <div className="relative overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-default-200">
                                        <thead>
                                            <tr className="text-start bg-default-100">
                                                <th className="px-6 py-3 text-start text-sm font-medium text-default-800"></th>
                                                <th className="px-6 py-3 text-start text-sm font-medium text-default-800">Type</th>
                                                <th className="px-6 py-3 text-start text-sm font-medium text-default-800">Date</th>
                                                <th className="px-6 py-3 text-start text-sm font-medium text-default-800">Status</th>
                                                <th className="px-6 py-3 text-start text-sm font-medium text-default-800">Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-default-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Tesco Market</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Shopping</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">13 Dec 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">Credit</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$75.67</td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Ann Marlin</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Shopping</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">31 Nov 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">Debit</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$430</td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">John Mathew Kayne</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Sport</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">06 Dec 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">Debit</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$350</td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Fiorgio Restaurant</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Food</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">07 Dec 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">Refund</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$19.50</td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">ElectroMen Market</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Shopping</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">14 Dec 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">Credit</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$250.00</td>
                                            </tr>

                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Ann Marlin</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">Grocery</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">31 Nov 2020</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">Credit</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-default-600">$430</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="xl:col-span-1">
                <div className="border border-default-200 rounded-lg">
                    <div className="p-6">
                        <div className="bg-white rounded-lg shadow dark:bg-default-100 border border-default-100 mb-6">
                            <div className="p-4 w-full">
                                <span className="flex items-center justify-start gap-4 w-full">
                                    <span className="shrink">
                                        <span className="inline-flex h-12 w-12 rounded-full overflow-hidden">
                                            <img src="/images/avatars/avatar3.png" className="max-w-full h-full rounded-full" />
                                        </span>
                                    </span>

                                    <div className="flex items-center w-full">
                                        <span className="grow text-start">
                                            <span className="block text-lg font-medium text-default-950">Kaiya Botosh</span>
                                            <span className="block text-xs font-medium text-default-950">demoexample@mail.com</span>
                                        </span>
                                        <span className="shrink"><i data-lucide="chevron-down" className="h-5 w-5"></i></span>
                                    </div>
                                </span>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h6 className="text-lg text-default-600 font-semibold mb-2">Total Balance</h6>
                            <h3 className="text-3xl text-default-900 font-semibold mb-2">$81,957.50</h3>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-500">
                                    <i data-lucide="trending-up" className="h-4 w-4"></i>
                                </span>
                                <span className="text-base text-default-500 font-medium">23.47%</span>
                            </div>

                            <div className="flex items-center justify-center flex-wrap gap-4">
                                <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Send</button>
                                <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Received</button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow dark:bg-default-100 border border-default-100 mb-6">
                            <div className="p-4">
                                <h6 className="text-lg text-default-900 font-semibold mb-3">Quick transfer</h6>
                                <div className="flex flex-wrap 2xl:flex-nowrap items-center gap-2 mb-6">
                                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                                        <div className="h-12 w-12">
                                            <img src="/images/avatars/avatar3.png" className="rounded-full" />
                                        </div>
                                        <p className="text-xs font-medium text-default-700">Hanna</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                                        <div className="h-12 w-12">
                                            <img src="/images/avatars/avatar4.png" className="rounded-full" />
                                        </div>
                                        <p className="text-xs font-medium text-default-700">Alena</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                                        <div className="h-12 w-12">
                                            <img src="/images/avatars/avatar6.png" className="rounded-full" />
                                        </div>
                                        <p className="text-xs font-medium text-default-700">Angel</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                                        <div className="h-12 w-12">
                                            <img src="/images/avatars/avatar5.png" className="rounded-full" />
                                        </div>
                                        <p className="text-xs font-medium text-default-700">Jhon</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                                        <div className="h-12 w-12">
                                            <img src="/images/avatars/avatar1.png" className="rounded-full" />
                                        </div>
                                        <p className="text-xs font-medium text-default-700">Jocelyn</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="grow">
                                        <input type="text" className="py-2.5 px-4 block w-full bg-transparent border-default-200 rounded-full text-sm focus:border-default-200 focus:ring-0" placeholder="0" />
                                    </div>

                                    <div className="shrink">
                                        <button className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-10 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <h6 className="relative inline-block text-lg text-default-900 font-semibold mb-3">Notifications <span className="absolute top-1 start-full inline-flex items-center w-2 h-2 rounded-full bg-primary"></span></h6>

                            <div className="flex items-start flex-wrap sm:flex-nowrap gap-4 w-full mb-4">
                                <div className="shrink">
                                    <span className="inline-flex h-12 w-12 rounded-full overflow-hidden">
                                        <img src="/images/avatars/avatar3.png" className="max-w-full h-full rounded-full" />
                                    </span>
                                </div>

                                <div className="flex items-center w-full">
                                    <span className="grow text-start">
                                        <span className="block text-lg font-medium text-default-900">Madelyn Torff</span>
                                        <span className="block text-xs font-medium text-default-600 mb-0.5">Just sent you $500</span>
                                        <Link href="#"> <span className="inline-block text-xs font-medium text-primary border-b border-primary">Click for more detail</span></Link>
                                    </span>
                                    <span className="text-sm text-default-800 font-medium shrink">Just now</span>
                                </div>
                            </div>

                            <div className="flex items-start flex-wrap sm:flex-nowrap gap-4 w-full mb-4">
                                <div className="shrink">
                                    <span className="inline-flex items-center justify-center h-12 w-12 bg-yellow-500/20 text-yellow-500 rounded-full overflow-hidden">
                                        <i data-lucide="wallet" className="h-6 w-6 "></i>
                                    </span>
                                </div>

                                <div className="flex items-center w-full">
                                    <span className="grow text-start">
                                        <span className="block text-lg font-medium text-default-900">Madelyn Torff</span>
                                        <span className="block text-xs font-medium text-default-600 mb-0.5">Just sent you $500</span>
                                    </span>
                                    <span className="text-sm text-default-800 font-medium shrink">Just now</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="javascript:void(0)" className="flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500">Pay now</Link>
                                <Link href="javascript:void(0)" className="flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-2.5 text-center text-xs font-semibold text-primary shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white">Later</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

