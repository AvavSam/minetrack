import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllUsers } from "@/lib/users";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = {
  title: "Manajemen Pengguna | Admin MineTrack",
  description: "Kelola akun pengguna, ubah peran, dan atur izin akses",
};

export default async function UserManagementPage() {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all users
  const users = await getAllUsers();

  return (
    <>
      <DashboardHeader />
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-2">Kelola akun pengguna, ubah peran, dan atur izin akses.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Pengguna</h2>
          </div>
          <UserManagementTable users={users} />
        </div>
      </div>
    </>
  );
}
