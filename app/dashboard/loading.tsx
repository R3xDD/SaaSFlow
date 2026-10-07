export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-7 sm:px-8 lg:px-10 lg:pt-10">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div className="h-36 animate-pulse rounded-2xl bg-white" key={item} />
        ))}
      </div>
    </div>
  );
}
