import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireApplicationUser } from "@/src/auth/session";

export default async function DashboardPage() {
  const { user } = await requireApplicationUser();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between border-b pb-6">
        <div>
          <p className="text-sm text-gray-600">Signed in as {user.email}</p>
          <h1 className="text-3xl font-bold">SaaSFlow dashboard</h1>
        </div>
        <SignOutButton />
      </header>
      <p className="mt-8 text-gray-600">Your private SaaSFlow workspace will appear here.</p>
    </main>
  );
}
