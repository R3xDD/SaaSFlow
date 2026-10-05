import { DashboardApp } from "@/components/dashboard/dashboard-app";
import { requireApplicationUser } from "@/src/auth/session";

export default async function DashboardPage() {
  const { user } = await requireApplicationUser();

  return <DashboardApp user={{ name: user.name, email: user.email }} />;
}
