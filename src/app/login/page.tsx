import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | MineTrack",
  description: "Login ke akun MineTrack Anda",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">MineTrack</h1>
          </Link>
          <p className="mt-2 text-gray-600">Masuk ke akun Anda untuk mengakses dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-medium underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} MineTrack. Semua hak dilindungi.</div>
      </div>
    </div>
  );
}
