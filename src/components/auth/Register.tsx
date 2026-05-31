import React from 'react'

export default function Register() {
    return (
        <div>
            <div className="relative md:h-screen sm:py-16 py-36 flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
                <div className="container">
                    <div className="flex justify-center items-center lg:max-w-lg">
                        <div className="flex flex-col h-full">
                            <div className="shrink">
                                <div className="pb-10">
                                    <a className="flex items-center" href="home.html">
                                        <img alt="logo" className="h-12 flex dark:hidden" src="/images/logo-dark.png" />
                                        <img alt="logo" className="h-12 hidden dark:flex" src="/images/logo-light.png" />
                                    </a>
                                </div>

                                <div className="">
                                    <h1 className="text-3xl font-semibold text-default-800 mb-2">Register</h1>
                                    <p className="text-sm text-default-500 max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod taempor.</p>
                                </div>

                                <div className="pt-16">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="FullName">Full Name</label>
                                        <input className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" id="FullName" placeholder="Enter your Name" type="email" />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="LoggingEmailAddress">Email</label>
                                        <input className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" id="LoggingEmailAddress" placeholder="Enter your email" type="email" />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="form-password">Password</label>
                                        <div className="flex" data-x-password>
                                            <input className="form-password block w-full rounded-s-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" id="form-password" placeholder="Enter your password" type="password" />
                                            <button className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-white -ms-px border-default-200 dark:bg-default-50" id="password-addon">
                                                <i className="password-eye-on h-5 w-5 text-default-600" data-lucide="eye"></i>
                                                <i className="password-eye-off h-5 w-5 text-default-600" data-lucide="eye-off"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <a className="relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base bg-primary text-white capitalize transition-all hover:bg-primary-500 w-full" href="home.html">
                                            Register
                                        </a>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button type="button" className="" aria-label="Sign up with Google">
                                                <img className="h-8 w-8" src="/images/icons/google.svg" alt="" />
                                            </button>

                                            <button type="button" className="" aria-label="Sign up with Facebook">
                                                <img className="h-8 w-8" src="/images/icons/facebook.svg" alt="" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grow flex items-end justify-center mt-16">
                                <p className="text-default-700 text-center mt-auto">Already have an account ?<a className="text-primary ms-1" href="login"><b>Login</b></a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="absolute top-1/2 -translate-y-1/3 start-0 end-0 w-full -z-10">
                        <img className="w-full opacity-50 flex" src="/images/other/wawe.png" />
                    </div>

                    <div className="absolute top-0 end-0 hidden xl:flex h-5/6">
                        <img className="w-full z-0" src="/images/other/auth-bg.png" />
                    </div>
                </div>
            </div>

            <div className="fixed lg:bottom-5 end-5 bottom-18 flex flex-col items-center bg-primary/25 rounded-full z-10">
                <button className="rounded-full h-10 w-10 bg-primary text-white flex justify-center items-center z-20">
                    <i className="h-5 w-5" data-lucide="sun" id="light-theme"></i>
                    <i className="h-5 w-5" data-lucide="moon" id="dark-theme"></i>
                </button>
            </div>
        </div>
    )
}

