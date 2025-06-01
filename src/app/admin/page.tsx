import { Suspense } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  CheckCircle,
  Clock,
  Mountain,
  RefreshCw,
  ArrowRight,
  Info,
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
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { AirQualityWidget } from "@/components/dashboard/air-quality-widget";
import { RecentActivityList } from "@/components/dashboard/recent-activity";
import { MineProvider } from "@/context/MineContext";
import { getTambangTerverifikasi } from "@/lib/tambang";
import { Lisensi } from "@/types/mine";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  // Sample notifications for dashboard display
  const notifications = [
    {
      id: 1,
      title: "Mine registration requires approval",
      message:
        "A new mine registration for East Kalimantan Coal Mine requires your approval.",
      type: "approval",
      priority: "high",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 2,
      title: "Environmental alert detected",
      message:
        "Water quality monitoring sensors have detected elevated levels of contaminants near Sukabumi Quarry.",
      type: "alert",
      priority: "high",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      title: "System maintenance scheduled",
      message:
        "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. The system may be temporarily unavailable.",
      type: "system",
      priority: "medium",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ];

  // Helper function to get icon for notification type from admin/notifications page
  function getNotificationIcon(type: string, priority: string) {
    switch (type) {
      case "approval":
        return (
          <CheckCircle
            className={`h-5 w-5 ${
              priority === "high" ? "text-green-500" : "text-green-400"
            }`}
          />
        );
      case "alert":
        return (
          <AlertTriangle
            className={`h-5 w-5 ${
              priority === "high" ? "text-red-500" : "text-red-400"
            }`}
          />
        );
      case "system":
        return (
          <Info
            className={`h-5 w-5 ${
              priority === "high" ? "text-blue-500" : "text-blue-400"
            }`}
          />
        );
      case "reminder":
        return (
          <Clock
            className={`h-5 w-5 ${
              priority === "high" ? "text-amber-500" : "text-amber-400"
            }`}
          />
        );
      case "user":
        return (
          <Bell
            className={`h-5 w-5 ${
              priority === "high" ? "text-purple-500" : "text-purple-400"
            }`}
          />
        );
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  }

  return (
    <MineProvider>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Summary cards */}
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
                  </Card>
                </div>
              </div>

              {/* Distribution Charts moved from mines-overview - now positioned below mine locations */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution by Mine Type</CardTitle>
                    <CardDescription>
                      Breakdown of mines by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        tambangData.reduce((acc: any, mine: any) => {
                          acc[mine.tipeTambang] =
                            (acc[mine.tipeTambang] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]: [string, any]) => (
                        <div key={type} className="flex items-center">
                          <div className="w-1/3 font-medium text-sm">
                            {type || "Unknown"}
                          </div>
                          <div className="w-2/3">
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{
                                    width: `${
                                      (count / tambangData.length) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {count}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribution by Province</CardTitle>
                    <CardDescription>
                      Top provinces by mine count
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        tambangData.reduce((acc: any, mine: any) => {
                          const province = mine.provinsi || "Unknown";
                          acc[province] = (acc[province] || 0) + 1;
                          return acc;
                        }, {})
                      )
                        .sort(
                          ([, a]: [string, any], [, b]: [string, any]) => b - a
                        )
                        .slice(0, 5)
                        .map(([region, count]: [string, any]) => (
                          <div key={region} className="flex items-center">
                            <div className="w-1/3 font-medium text-sm">
                              {region}
                            </div>
                            <div className="w-2/3">
                              <div className="flex items-center">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{
                                      width: `${
                                        (count / tambangData.length) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">
                                  {count}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recently Verified Mines section moved from verified-mines page */}
              <Card>
                <CardHeader>
                  <CardTitle>Recently Verified Mines</CardTitle>
                  <CardDescription>
                    Latest mines that received verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mine Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Verified On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tambangData
                        .filter((t: any) => t.lisensi === "valid")
                        .slice(0, 5)
                        .map((mine: any, index: number) => (
                          <TableRow key={mine._id || index}>
                            <TableCell className="font-medium">
                              {mine.name || `Mine ${index + 1}`}
                            </TableCell>
                            <TableCell>{mine.tipeTambang || "Coal"}</TableCell>
                            <TableCell>
                              {mine.provinsi || "West Java"}
                            </TableCell>
                            <TableCell>
                              {new Date().toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-500">Verified</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/verified-mines">
                      View all verified mines{" "}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

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
                  <CardContent className="p-0">
                    {/* Notifications content styled like admin/notifications page */}
                    <div className="space-y-0 max-h-[320px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start px-4 py-3 ${
                            !notification.isRead ? "bg-amber-50" : ""
                          } hover:bg-slate-50 border-b border-slate-100 transition-colors`}
                        >
                          <div className="mr-3 mt-0.5">
                            {getNotificationIcon(
                              notification.type,
                              notification.priority
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.isRead
                                      ? "text-slate-900"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                      New
                                    </span>
                                  )}
                                </h4>
                                <p
                                  className={`text-xs mt-1 ${
                                    !notification.isRead
                                      ? "text-slate-700"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                {(() => {
                                  const now = new Date();
                                  const notificationTime = new Date(
                                    notification.timestamp
                                  );
                                  const diffInHours = Math.floor(
                                    (now.getTime() -
                                      notificationTime.getTime()) /
                                      (1000 * 60 * 60)
                                  );
                                  return diffInHours < 1
                                    ? "Just now"
                                    : `${diffInHours}h ago`;
                                })()}
                              </span>
                            </div>

                            <div className="mt-2 flex items-center space-x-2">
                              <Badge
                                className={
                                  notification.priority === "high"
                                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                                    : notification.priority === "medium"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }
                              >
                                {notification.priority.charAt(0).toUpperCase() +
                                  notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
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
