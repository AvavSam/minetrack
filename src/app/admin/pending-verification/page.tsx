import {
  Clock,
  ArrowLeft,
  Filter,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTambangTerverifikasi } from "@/lib/tambang";
import { MineProvider } from "@/context/MineContext";
import { Badge } from "@/components/ui/badge";

export default async function PendingVerificationPage() {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Get all mines and filter for pending verification
  const tambangData = await getTambangTerverifikasi({});
  const pendingMines = tambangData.filter((mine: any) => !mine.verifikasi);

  // Calculate percentage of total
  const pendingPercentage = (pendingMines.length / tambangData.length) * 100;

  // Get mines by type
  const minesByType = pendingMines.reduce((acc: any, mine: any) => {
    acc[mine.tipeTambang] = (acc[mine.tipeTambang] || 0) + 1;
    return acc;
  }, {});

  // Get mines by region/province
  const minesByRegion = pendingMines.reduce((acc: any, mine: any) => {
    const province = mine.provinsi || "Unknown";
    acc[province] = (acc[province] || 0) + 1;
    return acc;
  }, {});

  // Calculate waiting time in days (mock data)
  const getRandomWaitingDays = () => Math.floor(Math.random() * 30) + 1;

  return (
    <MineProvider>
      <div className="flex flex-col min-h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/admin"
              className="flex items-center hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search pending mines..." className="pl-8" />
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              <Clock className="mr-2 h-6 w-6 text-amber-600" />
              Pending Verification
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                Flag All
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Start Verification
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Mines
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingMines.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingPercentage.toFixed(1)}% of total mines
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Wait Time
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">14 days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From submission to verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mine Types
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.keys(minesByType).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pending mine categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Oldest Pending
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-purple-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">42 days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Needs immediate attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Mines Awaiting Verification</CardTitle>
                  <CardDescription>
                    Submissions that require review and approval
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Verify Selected
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Mine Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Waiting</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingMines
                      .slice(0, 5)
                      .map((mine: any, index: number) => (
                        <TableRow key={mine._id || index}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {mine.name || `Pending Mine ${index + 1}`}
                          </TableCell>
                          <TableCell>{mine.tipeTambang || "Coal"}</TableCell>
                          <TableCell>{getRandomWaitingDays()} days</TableCell>
                          <TableCell>
                            {mine.provinsi || "East Kalimantan"}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-amber-500">Pending</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                />
                              </svg>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of {pendingMines.length} pending mines
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Bottlenecks</CardTitle>
                <CardDescription>
                  Areas with highest pending rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(minesByRegion)
                    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
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
                                className="h-2 bg-amber-500 rounded-full"
                                style={{
                                  width: `${
                                    (count / pendingMines.length) * 100
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

                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">
                    Verification Rate
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last 30 days</span>
                    <span className="font-medium">3.2 mines/day</span>
                  </div>
                  <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 w-[65%] bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>Target: 5 mines/day</span>
                    <span>Current: 65% of target</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MineProvider>
  );
}
