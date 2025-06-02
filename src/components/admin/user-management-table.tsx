"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserManagementTableProps {
  users: User[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const router = useRouter();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, string>>(users.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {}));

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah peran pengguna");
      }

      // Update local state
      setUserRoles((prev) => ({ ...prev, [userId]: newRole }));

      toast("Peran berhasil diubah", {
        description: "Peran pengguna telah berhasil diperbarui.",
      });

      // Refresh the page to update the data
      router.refresh();
    } catch (error) {
      toast("Gagal mengubah peran", {
        description: "Terjadi kesalahan saat mengubah peran pengguna.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Nama</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Peran</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 font-medium text-gray-900">{user.name}</td>
              <td className="px-4 py-4 text-gray-500">{user.email}</td>
              <td className="px-4 py-4">
                <Select value={userRoles[user.id]} onValueChange={(value) => handleRoleChange(user.id, value)} disabled={updatingUserId === user.id}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
