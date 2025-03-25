import { DashboardHeader } from "@/components/header";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronDown, MapPin, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="/img/bg.jpg" alt="Mining landscape" className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">Eksplorasi Tambang & Dampaknya di Sekitarmu</h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground md:text-2xl">Pantau lokasi tambang, izin legalitas, dan dampak lingkungan secara real-time.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Jelajahi Peta <MapPin className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Ajukan Tambang Baru <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-16 flex justify-center">
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Fitur Utama</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Kami menyediakan berbagai fitur untuk membantu Anda memantau dan memahami aktivitas tambang dan dampaknya terhadap lingkungan.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none bg-background/50 transition-all hover:bg-background hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Peta Interaktif</h3>
                <p className="text-muted-foreground">Lihat lokasi tambang dan dampaknya dengan mudah melalui peta interaktif yang intuitif.</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-background/50 transition-all hover:bg-background hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M8 9h8"></path>
                    <path d="M8 13h6"></path>
                    <path d="M18 4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v3l-4-3H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10z"></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Data Cuaca & Kualitas Udara</h3>
                <p className="text-muted-foreground">Integrasi dengan WeatherAPI untuk data real-time tentang kondisi cuaca dan kualitas udara.</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-background/50 transition-all hover:bg-background hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Validasi Tambang</h3>
                <p className="text-muted-foreground">Informasi yang diverifikasi oleh admin untuk memastikan keakuratan dan keandalan data.</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-background/50 transition-all hover:bg-background hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Partisipasi Pengguna</h3>
                <p className="text-muted-foreground">Ajukan informasi tambang baru dan bantu meningkatkan transparansi lingkungan.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Dampak Positif</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Lihat bagaimana platform kami membantu meningkatkan transparansi dan kesadaran lingkungan.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\avav.jpg" alt="Avav Abdillah" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Avav Abdillah</h3>
                    <p className="text-sm text-muted-foreground">Aktivis Lingkungan</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Platform ini sangat membantu kami dalam memantau aktivitas tambang di sekitar daerah konservasi. Data yang transparan membuat kami dapat berkolaborasi dengan pihak tambang untuk meminimalkan dampak lingkungan."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\mashaq.jpg" alt="Mashaq Ramadhan" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mashaq Ramadhan</h3>
                    <p className="text-sm text-muted-foreground">Peneliti Lingkungan</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Sebagai peneliti, saya sangat terbantu dengan adanya data kualitas udara dan cuaca yang terintegrasi dengan lokasi tambang. Ini memudahkan analisis dampak lingkungan jangka panjang."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\eci.jpg" alt="Mahreczy" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mahreczy Aditya</h3>
                    <p className="text-sm text-muted-foreground">Pemilik Tambang</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Platform ini membantu kami menunjukkan komitmen terhadap praktik tambang yang bertanggung jawab. Verifikasi dari admin memberikan kredibilitas pada operasi kami dan membangun kepercayaan dengan masyarakat sekitar."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\via.jpg" alt="Octavia Ramadhani" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Octavia Ramadhani</h3>
                    <p className="text-sm text-muted-foreground">Aktivis Lingkungan</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                "Sebagai peneliti, saya sangat terbantu dengan adanya data kualitas udara dan cuaca yang terintegrasi dengan lokasi tambang. Ini memudahkan analisis dampak lingkungan jangka panjang."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\taca.jpg" alt="Natasya Labaso" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Natasya Labaso</h3>
                    <p className="text-sm text-muted-foreground">Masyarakat</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                "Platform ini memudahkan kami untuk mengetahui aktivitas tambang di sekitar area konservasi. Dengan informasi yang transparan, kami bisa lebih sadar akan dampaknya dan turut serta dalam upaya menjaga lingkungan."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <img src="img\avav.jpg" alt="Abdillah Sam" width={48} height={48} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Abdillah Sam</h3>
                    <p className="text-sm text-muted-foreground">Pemilik Tambang</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                "Platform ini membantu kami menunjukkan komitmen terhadap praktik tambang yang bertanggung jawab. Verifikasi dari admin memberikan kredibilitas pada operasi kami dan membangun kepercayaan dengan masyarakat sekitar."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Mulai Jelajahi Sekarang</h2>
          <p className="mx-auto mb-8 max-w-2xl">Bergabunglah dengan ribuan pengguna lainnya untuk memantau aktivitas tambang dan dampaknya terhadap lingkungan.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="gap-2">
              Jelajahi Peta <MapPin className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
