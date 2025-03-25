import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register | MineTrack",
  description: "Daftar akun baru di MineTrack",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">MineTrack</h1>
          </Link>
          <p className="mt-2 text-gray-600">Daftar akun baru untuk mengakses fitur MineTrack</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daftar Akun</h2>
          <RegisterForm />
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="underline font-medium">
                Login sekarang
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} MineTrack. Semua hak dilindungi.</div>
      </div>
    </div>
  );
}
