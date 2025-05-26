import {
  CheckCircle,
  ArrowLeft,
  Filter,
  Download,
  Search,
  Map,
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

export default async function VerifiedMinesPage() {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Get verified mines only
  const tambangData = await getTambangTerverifikasi({});
  const verifiedMines = tambangData.filter(
    (mine: any) => mine.lisensi === "valid"
  );

  // Get mines by type
  const minesByType = verifiedMines.reduce((acc: any, mine: any) => {
    acc[mine.tipeTambang] = (acc[mine.tipeTambang] || 0) + 1;
    return acc;
  }, {});

  // Get mines by region/province
  const minesByRegion = verifiedMines.reduce((acc: any, mine: any) => {
    const province = mine.provinsi || "Unknown";
    acc[province] = (acc[province] || 0) + 1;
    return acc;
  }, {});

  // Calculate verification percentage
  const verificationPercentage =
    (verifiedMines.length / tambangData.length) * 100;

  return (
    <MineProvider>
      <div className="flex flex-col min-h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/admin"
              className="flex items-center hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verified mines..."
                  className="pl-8"
                />
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
              <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
              Verified Mines
            </h2>
            <Button className="bg-green-600 hover:bg-green-700">
              View All Mines
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Verified Mines
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verifiedMines.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {verificationPercentage.toFixed(1)}% of total mines
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
                  Verified mine categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Provinces</CardTitle>
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
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.keys(minesByRegion).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  With verified mines
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Verified
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 text-amber-600"
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
                <div className="text-xl font-bold">2 hours ago</div>
                <p className="text-xs text-muted-foreground mt-1">
                  By {session.user.name || "Admin"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
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
                    {verifiedMines
                      .slice(0, 5)
                      .map((mine: any, index: number) => (
                        <TableRow key={mine._id || index}>
                          <TableCell className="font-medium">
                            {mine.name || `Mine ${index + 1}`}
                          </TableCell>
                          <TableCell>{mine.tipeTambang || "Coal"}</TableCell>
                          <TableCell>{mine.provinsi || "West Java"}</TableCell>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Show on Map
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution by Mine Type</CardTitle>
                <CardDescription>Verified mines by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(minesByType).map(
                    ([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center">
                        <div className="w-1/3 font-medium text-sm">
                          {type || "Unknown"}
                        </div>
                        <div className="w-2/3">
                          <div className="flex items-center">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-green-500 rounded-full"
                                style={{
                                  width: `${
                                    (count / verifiedMines.length) * 100
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
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MineProvider>
  );
}
