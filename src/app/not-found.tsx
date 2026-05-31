export default function NotFound() {
    return (
        <section className="py-10">
            <div className="container">
                <div className="flex items-center justify-center">
                    <div className="">
                        <div className="flex justify-center w-full h-full mb-10">
                            <img src="/images/other/error404.png" className="max-w-full h-full" />
                        </div>

                        <div className="text-center max-w-xl">
                            <h1 className="text-5xl font-semibold text-default-800 mb-4">Ooops...</h1>
                            <h3 className="text-2xl font-medium text-default-800 mb-4">It’s look like you’re lost...</h3>
                            <p className="text-base text-default-600 max-w-xl mx-auto mb-8">Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the page is removed.</p>
                            <div className="flex items-center justify-center flex-wrap gap-4">
                                <a href="javascript:void(0)" className="w-1/2 lg:w-2/6 px-6 py-3 rounded-full text-base font-medium bg-primary text-white capitalize transition-all hover:bg-primary-500">
                                    Go Back
                                </a>

                                <a href="home.html" className="w-1/2 lg:w-2/6 relative inline-flex items-center justify-center font-medium px-6 py-3 rounded-full text-base border border-primary text-primary capitalize transition-all hover:bg-primary hover:text-white">
                                    Go To home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}