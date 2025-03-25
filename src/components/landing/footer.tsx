import { Facebook, Github, Instagram, Linkedin, Mountain, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-semibold">MineTrack</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Platform untuk memantau aktivitas tambang dan dampaknya terhadap lingkungan secara transparan dan akurat.</p>
            <div className="mt-6 flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">
                  Testimoni
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/map" className="text-muted-foreground transition-colors hover:text-foreground">
                  Peta Interaktif
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mines" className="text-muted-foreground transition-colors hover:text-foreground">
                  Database Tambang
                </Link>
              </li>
              <li>
                <Link href="/dashboard/environmental" className="text-muted-foreground transition-colors hover:text-foreground">
                  Data Lingkungan
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground transition-colors hover:text-foreground">
                  API Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Berlangganan</h3>
            <p className="mb-4 text-sm text-muted-foreground">Dapatkan pembaruan terbaru tentang tambang dan lingkungan di sekitar Anda.</p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Email Anda" className="max-w-[240px]" />
              <Button type="submit">Daftar</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 MineTrack. Hak Cipta Dilindungi.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Syarat dan Ketentuan
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
