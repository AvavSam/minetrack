"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MapSelector from "./map";

// Skema validasi form
const formSchema = z.object({
  namaTambang: z.string().min(3, {
    message: "Nama tambang harus minimal 3 karakter",
  }),
  tipeTambang: z.string({
    required_error: "Pilih tipe tambang",
  }),
  koordinat: z.object(
    {
      lat: z.number(),
      lng: z.number(),
    },
    {
      required_error: "Pilih lokasi tambang pada peta",
    }
  ),
  deskripsi: z
    .string()
    .min(10, {
      message: "Deskripsi tambang harus minimal 10 karakter",
    })
    .max(500, {
      message: "Deskripsi tambang maksimal 500 karakter",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function PengajuanTambangForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  // Default values untuk form
  const defaultValues: Partial<FormValues> = {
    koordinat: { lat: -2.5489, lng: 118.0149 }, // Default ke tengah Indonesia
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tambang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          verifikasi: false, // Default false untuk pengajuan baru
        }),
      });

      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat mengirim data");
      }

      setSubmitSuccess(true);
      toast("Pengajuan Berhasil", {
        description: "Data tambang telah dikirim untuk diverifikasi oleh admin.",
      });

      // Arahkan ke dashboard setelah 2 detik
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Pengajuan Gagal", {
        description: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handler untuk update koordinat dari peta
  const handleMapLocationSelect = (lat: number, lng: number) => {
    form.setValue("koordinat", { lat, lng }, { shouldValidate: true });
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {submitSuccess ? (
          <Alert className="bg-green-50 border-green-200 mb-6">
            <AlertTitle className="text-green-800 font-medium">Pengajuan Berhasil!</AlertTitle>
            <AlertDescription className="text-green-700">Data tambang telah dikirim untuk diverifikasi oleh admin. Terima kasih atas kontribusi Anda.</AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="namaTambang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tambang</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama tambang" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipeTambang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Tambang</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe tambang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="emas">Emas</SelectItem>
                            <SelectItem value="batu_bara">Batu Bara</SelectItem>
                            <SelectItem value="nikel">Nikel</SelectItem>
                            <SelectItem value="tembaga">Tembaga</SelectItem>
                            <SelectItem value="bijih_besi">Bijih Besi</SelectItem>
                            <SelectItem value="timah">Timah</SelectItem>
                            <SelectItem value="bauksit">Bauksit</SelectItem>
                            <SelectItem value="mangan">Mangan</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Tambang</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Deskripsikan tambang ini secara detail" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormDescription>Jelaskan informasi penting tentang tambang ini</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="koordinat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi Tambang</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <MapSelector initialPosition={field.value} onLocationSelect={handleMapLocationSelect} />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-gray-500">Latitude</label>
                                <Input value={field.value?.lat.toFixed(6) || ""} readOnly className="bg-gray-50" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Longitude</label>
                                <Input value={field.value?.lng.toFixed(6) || ""} readOnly className="bg-gray-50" />
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Klik pada peta untuk memilih lokasi tambang</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Ajukan Tambang"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
