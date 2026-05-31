import React from 'react'

export default function Contact() {
    return (
        <div>
            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-5 gap-10">
                        <div className="lg:col-span-2">
                            <h1 className="text-2xl font-semibold text-default-800 mb-2">Contact Information</h1>
                            <p className="text-sm text-default-600 max-w-xl mb-8">Loremum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis.</p>

                            <div className="flex items-center justify-center">
                                <img src="/images/other/contact.png" className="max-w-full h-full" />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <form>
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-base/normal text-default-950 mb-2" htmlFor="firstName">First Name</label>
                                        <input id="firstName" className="block w-full rounded-full py-2.5 px-4 bg-transparent dark:bg-default-50 border border-default-200 focus:ring-transparent focus:border-default-200" type="text" placeholder="First name" />
                                    </div>

                                    <div>
                                        <label className="block text-base/normal text-default-950 mb-2" htmlFor="lastName">Last Name</label>
                                        <input id="lastName" className="block w-full rounded-full py-2.5 px-4 bg-transparent dark:bg-default-50 border border-default-200 focus:ring-transparent focus:border-default-200" type="text" placeholder="Last Name" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-base/normal text-default-950 mb-2" htmlFor="e_mail">E-mail</label>
                                        <input id="e_mail" className="block w-full rounded-full py-2.5 px-4 bg-transparent dark:bg-default-50 border border-default-200 focus:ring-transparent focus:border-default-200" type="email" placeholder="Enter your email" />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-base/normal text-default-950 mb-2" htmlFor="message">Message</label>
                                        <textarea id="message" className="block w-full rounded-lg py-2.5 px-4 bg-transparent dark:bg-default-50 border border-default-200 focus:ring-transparent focus:border-default-200" rows={5} placeholder="Enter your message"></textarea>
                                    </div>

                                    <div>
                                        <a href="javascript:void(0)" className="inline-flex items-center justify-center px-10 py-3 rounded-full text-base font-medium bg-primary text-white capitalize transition-all hover:bg-primary-500">Send Message</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:py-16 py-6">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="bg-default-400/10 rounded-lg">
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary">
                                        <i data-lucide="phone" className="h-5 w-5 text-primary fill-white"></i>
                                    </span>
                                    <h4 className="text-lg font-medium text-default-950">Call Us</h4>
                                </div>
                                <p className="text-default-500 text-sm mb-2">+1 234 XXXX 123</p>
                                <p className="text-default-500 text-sm">+1 234 XXXX 567</p>
                            </div>
                        </div>

                        <div className="bg-default-400/10 rounded-lg">
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                                        <i data-lucide="mail" className="h-5 w-5 text-primary fill-white"></i>
                                    </span>
                                    <h4 className="text-lg font-medium text-default-950">Email</h4>
                                </div>
                                <p className="text-default-500 text-sm mb-2">demomail123@mail.com</p>
                                <p className="text-default-500 text-sm">helpdemo123@mail.com</p>
                            </div>
                        </div>

                        <div className="bg-default-400/10 rounded-lg">
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                                        <i data-lucide="map-pin" className="h-5 w-5 text-primary fill-white"></i>
                                    </span>
                                    <h4 className="text-lg font-medium text-default-950">Address</h4>
                                </div>
                                <p className="text-default-500 text-sm mb-2">37125 Maya Estate Dr, Victoria Road,</p>
                                <p className="text-default-500 text-sm">Warsaw, Poland - 234834</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

