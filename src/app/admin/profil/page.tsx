"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Edit, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/header";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Redirect non-admins to user profile
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard/profile");
    }

    // Load admin data
    if (status === "authenticated" && session?.user) {
      setAdminProfile({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      // Kirim data profil ke API
      const response = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      // Update data sesi jika diperlukan
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: adminProfile.name,
            email: adminProfile.email,
          },
        });
      }

      setIsEditing(false);

      toast.success("Profil Diperbarui");

      // Tambahkan timeout singkat sebelum refresh halaman
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error saving profile:", error);

      toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil admin");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin")} className="flex items-center gap-1 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-col items-center">
                <CardTitle className="mt-4">{session?.user?.name}</CardTitle>
                <CardDescription>{session?.user?.email}</CardDescription>
                <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Administrator</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Admin Level: Full Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Information</CardTitle>
                  <CardDescription>Update your administrator details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input id="name" name="name" value={adminProfile.name} onChange={handleInputChange} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" value={adminProfile.email} onChange={handleInputChange} disabled={!isEditing} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant={isEditing ? "default" : "outline"} onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))} className="flex items-center gap-2" disabled={isLoading}>
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
