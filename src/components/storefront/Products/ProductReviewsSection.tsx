/** Static reviews UI (placeholder until reviews API exists). */
export default function ProductReviewsSection() {
  return (
    <>
      <h4 className="text-xl font-semibold text-default-800 mb-4">Customer Rating</h4>

      <div className="grid lg:grid-cols-4 items-center gap-5">
        <div className="bg-primary/10 py-8 rounded-lg flex flex-col items-center justify-center">
          <h1 className="text-6xl font-semibold text-default-800 mb-4">4.7</h1>
          <div className="flex gap-1.5 mb-2">
            <span><i className="iconify fa7-solid--star text-lg text-yellow-400" /></span>
            <span><i className="iconify fa7-solid--star text-lg text-yellow-400" /></span>
            <span><i className="iconify fa7-solid--star text-lg text-yellow-400" /></span>
            <span><i className="iconify fa7-solid--star text-lg text-yellow-400" /></span>
            <span><i className="iconify fa7-solid--star text-lg text-default-200" /></span>
          </div>
          <h4 className="text-base font-medium text-default-700">
            Customer Rating{" "}
            <span className="font-normal text-default-500">(23,476)</span>
          </h4>
        </div>

        <div className="xl:col-span-2 md:col-span-3">
          <div className="grid md:grid-cols-12 items-center gap-2 mb-3">
            <div className="md:col-span-3 flex gap-1.5 lg:justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>
                  <i className="iconify fa7-solid--star text-lg text-yellow-400" />
                </span>
              ))}
            </div>
            <div className="md:col-span-7">
              <div className="flex w-full h-1 bg-default-200 rounded-full overflow-hidden">
                <div className="flex flex-col justify-center overflow-hidden bg-primary w-4/6 rounded" />
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="inline-block text-sm font-medium text-default-700">66%</h4>
              <span className="font-normal text-default-500"> (94,532)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <h4 className="text-base font-medium text-default-800">Customer Review</h4>
        <p className="text-sm text-default-500 py-6">
          Reviews are coming soon.
        </p>
      </div>
    </>
  );
}
