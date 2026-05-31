import React from 'react'

export default function ResetPassword() {
    return (
        <div>
            <div className="relative md:h-screen sm:py-16 py-36 flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
                <div className="container">
                    <div className="flex justify-center items-center lg:max-w-lg">
                        <div className="flex flex-col h-full">
                            <div className="shrink">
                                <div className="pb-10">
                                    <a href="home.html" className="flex items-center">
                                        <img src="/images/logo-dark.png" alt="logo" className="h-12 flex dark:hidden" />
                                        <img src="/images/logo-light.png" alt="logo" className="h-12 hidden dark:flex" />
                                    </a>
                                </div>

                                <div className="">
                                    <h1 className="text-3xl font-semibold text-default-800 mb-2">Reset Password</h1>
                                    <p className="text-sm text-default-500 max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod taempor.</p>
                                </div>

                                <div className="pt-16">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="new_password">New Password</label>
                                        <input id="new_password" className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="Enter your email" />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-default-900 mb-2" htmlFor="confirm_new_password">Confirm New Password</label>
                                        <input id="confirm_new_password" className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50" type="email" placeholder="Enter your email" />
                                    </div>

                                    <div className="flex flex-col justify-center gap-4 mb-6">
                                        <a href="login" className="relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base bg-primary text-white capitalize transition-all hover:bg-primary-500 w-full">
                                            Reset Password
                                        </a>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button type="button" className="" aria-label="Sign in with Google">
                                                <img src="/images/icons/google.svg" alt="" className="h-8 w-8" />
                                            </button>

                                            <button type="button" className="" aria-label="Sign in with Facebook">
                                                <img src="/images/icons/facebook.svg" alt="" className="h-8 w-8" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grow flex items-end justify-center mt-16">
                                <p className="text-default-950 text-center mt-auto">Back to<a href="login" className="text-primary ms-1"><span className="font-medium">Login</span></a></p>
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
                    <i className="h-5 w-5" data-lucide="sun" id="light-theme"></i>
                    <i className="h-5 w-5" data-lucide="moon" id="dark-theme"></i>
                </button>
            </div>
        </div>
    )
}

