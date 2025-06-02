"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Edit, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Redirect admins to admin profile
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/admin/profil");
    }

    // Load user data
    if (status === "authenticated" && session?.user) {
      setUserProfile({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Send profile data to API
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      // Update session data
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: userProfile.name,
            email: userProfile.email,
          },
        });
      }

      setSuccessMessage("Profil berhasil diperbarui");
      setIsEditing(false);

      // Tambahkan toast untuk notifikasi
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage(error instanceof Error ? error.message : "Gagal memperbarui profil");

      // Tambahkan toast untuk notifikasi error
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="flex items-center gap-1 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Dasbor
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-col items-center">
                <CardTitle className="mt-4">{session?.user?.name}</CardTitle>
                <CardDescription>{session?.user?.email}</CardDescription>
                <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Operator</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{session?.user?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pengguna</CardTitle>
                  <CardDescription>Perbarui detail profil Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nama Lengkap
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input id="name" name="name" value={userProfile.name} onChange={handleInputChange} disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Alamat Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" value={userProfile.email} onChange={handleInputChange} disabled={!isEditing} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant={isEditing ? "default" : "outline"} onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))} className="flex items-center gap-2" disabled={isLoading}>
                    {isEditing ? (
                      <>
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
