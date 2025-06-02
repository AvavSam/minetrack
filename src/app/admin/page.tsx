import { Suspense } from "react";
import { Activity, AlertTriangle, BarChart2, Bell, CheckCircle, Clock, Mountain, RefreshCw, ArrowRight, Info } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import MapWrapper from "@/components/dashboard/MapWrapper";
import { MineTable } from "@/components/dashboard/mine-table";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { AirQualityWidget } from "@/components/dashboard/air-quality-widget";
import { MineProvider } from "@/context/MineContext";
import { getAllTambang } from "@/lib/tambang";
import { Lisensi } from "@/types/mine";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Add searchParams as a prop to the page component
export default async function AdminPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Resolve searchParams before using them
  const params = await Promise.resolve(searchParams);
  const search = typeof params.search === "string" ? params.search : "";
  const tipeTambang = typeof params.tipeTambang === "string" ? params.tipeTambang : "";
  const lisensi = (typeof params.lisensi === "string" ? params.lisensi : "") as Lisensi;

  const tambangData = await getAllTambang({
    search,
    tipeTambang,
    lisensi,
  });

  return (
    <MineProvider>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-blue-500 flex flex-row items-center p-4 space-x-4">
              <Mountain className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-sm font-medium">Total Mines</CardTitle>
                <div className="text-2xl font-bold">{tambangData.length.toString()}</div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-green-500 flex flex-row items-center p-4 space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-sm font-medium">Verified Mines</CardTitle>
                <div className="text-2xl font-bold">{tambangData.filter(mine => mine.verifikasi === true).length.toString()}</div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-amber-500 flex flex-row items-center p-4 space-x-4">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <div className="text-2xl font-bold">{tambangData.filter(mine => mine.verifikasi === false).length.toString()}</div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mines">Mines</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-5 pb-0">
                  <CardHeader>
                    <CardTitle>Mine Locations</CardTitle>
                    <CardDescription>Interactive map showing all mine locations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[500px] rounded-md border">
                      <Suspense fallback={<div className="flex h-full items-center justify-center">Loading map...</div>}>
                        <MapWrapper />
                      </Suspense>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-4 lg:col-span-2">
                  <WeatherWidget />

                  <AirQualityWidget />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution by Mine Type</CardTitle>
                    <CardDescription>Breakdown of mines by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        tambangData.reduce((acc: any, mine: any) => {
                          acc[mine.tipeTambang] = (acc[mine.tipeTambang] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]: [string, any]) => (
                        <div key={type} className="flex items-center">
                          <div className="w-1/3 font-medium text-sm">{type || "Unknown"}</div>
                          <div className="w-2/3">
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{
                                    width: `${(count / tambangData.length) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mine Status Distribution</CardTitle>
                    <CardDescription>Breakdown of mines by verification and license status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Verified Mines */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Verified</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-green-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.verifikasi === true).length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.verifikasi === true).length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Unverified Mines */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Unverified</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-amber-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.verifikasi === false).length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.verifikasi === false).length}</span>
                          </div>
                        </div>
                      </div>

                      {/* License: Valid */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Valid License</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-blue-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.lisensi === "valid").length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.lisensi === "valid").length}</span>
                          </div>
                        </div>
                      </div>

                      {/* License: Pending */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Pending License</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-yellow-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.lisensi === "pending").length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.lisensi === "pending").length}</span>
                          </div>
                        </div>
                      </div>

                      {/* License: Expiring */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Expiring License</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-orange-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.lisensi === "expiring").length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.lisensi === "expiring").length}</span>
                          </div>
                        </div>
                      </div>

                      {/* License: Expired */}
                      <div className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">Expired License</div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2.5 bg-red-500 rounded-full"
                                style={{
                                  width: `${(tambangData.filter((mine) => mine.lisensi === "expired").length / tambangData.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{tambangData.filter((mine) => mine.lisensi === "expired").length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mine Database</CardTitle>
                  <CardDescription>Manage and monitor all registered mines</CardDescription>
                </CardHeader>
                <CardContent>
                  <MineTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </MineProvider>
  );
}
