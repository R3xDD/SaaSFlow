export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">SaaSFlow</h1>

          <div className="flex gap-3">
            <button className="rounded-md border px-4 py-2">
              Sign in
            </button>

            <button className="rounded-md bg-black px-4 py-2 text-white">
              Get started
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          Manage your development projects with SaaSFlow.
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          A simple workspace for managing projects, tasks, teammates,
          and development workflows.
        </p>

        <button className="mt-8 rounded-md bg-black px-6 py-3 text-white">
          Get started
        </button>
      </section>
    </main>
  );
}