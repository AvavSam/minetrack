import { Suspense } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Clock,
  Mountain,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  const tipeTambang =
    typeof params.tipeTambang === "string" ? params.tipeTambang : "";
  const lisensi = (
    typeof params.lisensi === "string" ? params.lisensi : ""
  ) as Lisensi;

  const tambangData = await getTambangTerverifikasi({
    search,
    tipeTambang,
    lisensi,
  });

  const ClickableCard = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className="block transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
    >
      {children}
    </Link>
  );

  return (
    <MineProvider>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ClickableCard href="/admin/mines-overview">
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Mines
                  </CardTitle>
                  <Mountain className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tambangData.length.toString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      View details
                    </p>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </ClickableCard>

            <ClickableCard href="/admin/verified-mines">
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Verified Mines
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tambangData
                      .filter((t: { lisensi: string }) => t.lisensi === "valid")
                      .length.toString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      View details
                    </p>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </ClickableCard>

            <ClickableCard href="/admin/pending-verification">
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-amber-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Verification
                  </CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tambangData
                      .filter((t: { verifikasi: boolean }) => !t.verifikasi)
                      .length.toString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    16.9% of total mines
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      View details
                    </p>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </ClickableCard>

            <ClickableCard href="/admin/environmental-alerts">
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-red-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Environmental Alerts
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">19</div>
                  <p className="text-xs text-muted-foreground">
                    +3 from yesterday
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      View details
                    </p>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </ClickableCard>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mines">Mines</TabsTrigger>
              <TabsTrigger value="environmental">
                Environmental Data
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-5">
                  <CardHeader>
                    <CardTitle>Mine Locations</CardTitle>
                    <CardDescription>
                      Interactive map showing all mine locations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[500px] rounded-md border">
                      <Suspense
                        fallback={
                          <div className="flex h-full items-center justify-center">
                            Loading map...
                          </div>
                        }
                      >
                        <MapWrapper />
                      </Suspense>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/map">
                        View full map <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <div className="flex flex-col gap-4 lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weather</CardTitle>
                      <CardDescription>
                        Current conditions at selected location
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WeatherWidget />
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/admin/weather">
                          View details <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Air Quality</CardTitle>
                      <CardDescription>
                        Current measurements at selected location
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AirQualityWidget />
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/admin/air-quality">
                          View details <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-1">
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest actions and updates
                      </CardDescription>
                    </div>
                    <RefreshCw className="ml-auto h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <RecentActivityList />
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/activity">
                        View all activity{" "}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Recent alerts and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationPanel />
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/notifications">
                        View all notifications{" "}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mine Database</CardTitle>
                  <CardDescription>
                    Manage and monitor all registered mines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MineTable />
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/mines-database">
                      Advanced management{" "}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="environmental" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>
                    Monitor environmental data and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Activity className="mr-2 h-4 w-4" />
                    Environmental data visualization coming soon
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/environmental">
                      View detailed reports{" "}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </MineProvider>
  );
}
