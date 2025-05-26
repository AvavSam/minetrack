import { Suspense } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock, Mountain, RefreshCw } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import MapWrapper from "@/components/dashboard/MapWrapper";
import { MineTable } from "@/components/dashboard/mine-table";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { AirQualityWidget } from "@/components/dashboard/air-quality-widget";
import { RecentActivityList } from "@/components/dashboard/recent-activity";
import { MineProvider } from "@/context/MineContext";
import { getTambangTerverifikasi } from "@/lib/tambang";
import { Lisensi } from "@/types/mine";

// Add searchParams as a prop to the page component
export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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

  // Convert Lisensi type to the type expected by getTambangTerverifikasi
  const lisensiParam = lisensi === "expiring" ? undefined : lisensi as "pending" | "valid" | undefined;
  const tambangData = await getTambangTerverifikasi({ search, tipeTambang, lisensi: lisensiParam });

  return (
    <MineProvider>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Mines</CardTitle>
                <Mountain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tambangData.length.toString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Mines</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tambangData.filter((t: { lisensi: string }) => t.lisensi === "valid").length.toString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tambangData.filter((t: { verifikasi: boolean }) => !t.verifikasi).length.toString()}</div>
                <p className="text-xs text-muted-foreground">16.9% of total mines</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Environmental Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">19</div>
                <p className="text-xs text-muted-foreground">+3 from yesterday</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mines">Mines</TabsTrigger>
              <TabsTrigger value="environmental">Environmental Data</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-5">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Weather</CardTitle>
                      <CardDescription>Current conditions at selected location</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WeatherWidget />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Air Quality</CardTitle>
                      <CardDescription>Current measurements at selected location</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AirQualityWidget />
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-1">
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions and updates</CardDescription>
                    </div>
                    <RefreshCw className="ml-auto h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <RecentActivityList />
                  </CardContent>
                </Card>
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Recent alerts and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationPanel />
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
            <TabsContent value="environmental" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Monitor environmental data and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Activity className="mr-2 h-4 w-4" />
                    Environmental data visualization coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </MineProvider>
  );
}
