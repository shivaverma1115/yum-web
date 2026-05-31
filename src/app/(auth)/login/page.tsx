import React from 'react'

export default function LoginPage() {
    return (
        <div>
            <div className="relative md:h-screen sm:py-16 py-36 flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
                <div className="container">
                    <div className="flex justify-center items-center lg:max-w-lg">
                        <div className="flex flex-col h-full">
                            <div className="shrink">
                                <div>
                                    <a href="home.html" className="flex items-center">
                                        <img src="/images/logo-dark.png" alt="logo" className="h-12 flex dark:hidden" />
                                        <img src="/images/logo-light.png" alt="logo" className="h-12 hidden dark:flex" />
                                    </a>
                                </div>

                                <div className="py-10">
                                    <h1 className="text-3xl font-semibold text-default-800 mb-2">Login</h1>
                                    <p className="text-sm text-default-500 max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod taempor.</p>
                                </div>

                                <form data-x-form data-x-form-to="home.html">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="LoggingEmailAddress">Email</label>
                                        <input data-x-field="email" id="LoggingEmailAddress" defaultValue="user@demo.com" className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="Enter your email" />
                                        <span data-x-field-error="email" className="text-red-500"></span>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-default-900" htmlFor="form-password">Password</label>
                                            <a href="recover-password" className="text-xs text-default-700">Forget Password ?</a>
                                        </div>

                                        <div className="flex" data-x-password>
                                            <input data-x-field="password" defaultValue="password" type="password" id="form-password" className="form-password block w-full rounded-s-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" placeholder="Enter your password" />
                                            <button type="button" id="password-addon" className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-white -ms-px border-default-200 dark:bg-default-50">
                                                <i className="password-eye-on h-5 w-5 text-default-600" data-lucide="eye"></i>
                                                <i className="password-eye-off h-5 w-5 text-default-600" data-lucide="eye-off"></i>
                                            </button>
                                        </div>

                                        <span data-x-field-error="password" className="text-red-500"></span>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <button type="submit" className="relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base bg-primary text-white capitalize transition-all hover:bg-primary-500 w-full">Log In </button>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <a href="javascript:void(0)" className="">
                                                <img src="/images/icons/google.svg" className="h-8 w-8" />
                                            </a>

                                            <a href="javascript:void(0)" className="">
                                                <img src="/images/icons/facebook.svg" className="h-8 w-8" />
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="grow flex items-end justify-center mt-16">
                                <p className="text-default-950 text-center mt-auto">Don’t have an account ? <a href="register" className="text-primary ms-1"><span className="font-medium">Register</span></a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="absolute top-1/2 -translate-y-1/3 start-0 end-0 w-full -z-10">
                        <img src="/images/other/wawe.png" className="w-full opacity-50 flex" />
                    </div>

                    <div className="absolute top-0 end-0 hidden xl:flex h-5/6">
                        <img src="/images/other/auth-bg.png" className="w-full z-0" />
                    </div>
                </div>
            </div>

            <div className="fixed lg:bottom-5 end-5 bottom-18 flex flex-col items-center bg-primary/25 rounded-full z-10">
                <button className="rounded-full h-10 w-10 bg-primary text-white flex justify-center items-center z-20">
                    <i className="h-5 w-5" data-lucide="sun" id="light-theme" />
                    <i className="h-5 w-5" data-lucide="moon" id="dark-theme" />
                </button>
            </div>
        </div>
    )
}

