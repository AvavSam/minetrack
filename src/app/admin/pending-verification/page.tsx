"use client";

import { useState, useEffect } from "react";
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
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
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
// Remove the Dialog imports if not available
// Remove the DropdownMenu imports if not available
// Remove the Checkbox and Label imports if not available
import { MineProvider } from "@/context/MineContext";
import { Badge } from "@/components/ui/badge";

// Function to fetch Central Sulawesi pending mines
const fetchPendingMines = async () => {
  try {
    // In a real app, fetch from your API with filters
    const response = await fetch(
      "/api/tambang?provinsi=Sulawesi Tengah&verifikasi=false"
    );

    // If API doesn't exist, use mock data
    if (!response.ok) {
      // Mock data for pending mines in Central Sulawesi
      return [
        {
          _id: "st004",
          name: "Tambang Nikel Banggai",
          tipeTambang: "Nikel",
          provinsi: "Sulawesi Tengah",
          kabupaten: "Banggai",
          verifikasi: false,
          lisensi: "pending",
          coordinates: { lat: -1.3083, lng: 122.5217 },
          status: "pending",
          luasArea: 567.2,
          tahunOperasi: null,
          submissionDate: "2023-02-15",
        },
        {
          _id: "st005",
          name: "Tambang Tembaga Tojo Una-Una",
          tipeTambang: "Tembaga",
          provinsi: "Sulawesi Tengah",
          kabupaten: "Tojo Una-Una",
          verifikasi: false,
          lisensi: "pending",
          coordinates: { lat: -0.5413, lng: 121.4138 },
          status: "pending",
          luasArea: 320.8,
          tahunOperasi: null,
          submissionDate: "2023-05-22",
        },
        {
          _id: "st008",
          name: "Tambang Nikel Morowali Utara",
          tipeTambang: "Nikel",
          provinsi: "Sulawesi Tengah",
          kabupaten: "Morowali Utara",
          verifikasi: false,
          lisensi: "pending",
          coordinates: { lat: -1.8912, lng: 121.5134 },
          status: "pending",
          luasArea: 875.1,
          tahunOperasi: null,
          submissionDate: "2023-07-10",
        },
      ];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pending mines:", error);
    return [];
  }
};

export default function PendingVerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pendingMines, setPendingMines] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Simplify the state since we can't use the filters without the components
  const [selectedMineType, setSelectedMineType] = useState<string>("");

  // Calculate waiting time in days
  const calculateWaitingDays = (submissionDate: string) => {
    const now = new Date();
    const submitted = new Date(submissionDate);
    const diffTime = Math.abs(now.getTime() - submitted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    // Check authentication
    if (status === "unauthenticated") {
      router.push("/dashboard");
    }

    if (status === "authenticated" && session?.user.role !== "admin") {
      router.push("/dashboard");
    }

    // Fetch data
    const fetchData = async () => {
      const data = await fetchPendingMines();

      // Add waiting days to each mine
      const dataWithWaiting = data.map((mine: any) => ({
        ...mine,
        waitingDays:
          mine.submissionDate !== null
            ? calculateWaitingDays(mine.submissionDate)
            : Math.floor(Math.random() * 30) + 1,
      }));

      setPendingMines(dataWithWaiting);
      setFilteredData(dataWithWaiting);
      setLoading(false);
    };

    fetchData();
  }, [status, session, router]);

  // Filter data based on search term and basic filters
  useEffect(() => {
    if (pendingMines.length === 0) return;

    let filtered = [...pendingMines];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (mine) =>
          mine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mine.tipeTambang.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mine.kabupaten.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply simple type filter
    if (selectedMineType) {
      filtered = filtered.filter(
        (mine) => mine.tipeTambang === selectedMineType
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedMineType, pendingMines]);

  // Get mines by type
  const minesByType = filteredData.reduce((acc: any, mine: any) => {
    acc[mine.tipeTambang] = (acc[mine.tipeTambang] || 0) + 1;
    return acc;
  }, {});

  // Get mines by region/district
  const minesByRegion = filteredData.reduce((acc: any, mine: any) => {
    const kabupaten = mine.kabupaten || "Unknown";
    acc[kabupaten] = (acc[kabupaten] || 0) + 1;
    return acc;
  }, {});

  // Get unique mine types
  const uniqueTypes = Array.from(
    new Set(pendingMines.map((mine) => mine.tipeTambang))
  );

  // Calculate average waiting time
  const avgWaitTime =
    filteredData.length > 0
      ? Math.round(
          filteredData.reduce((sum, mine) => sum + mine.waitingDays, 0) /
            filteredData.length
        )
      : 0;

  // Calculate oldest pending
  const oldestPending =
    filteredData.length > 0
      ? Math.max(...filteredData.map((mine) => mine.waitingDays))
      : 0;

  // Handler for export function
  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Type",
      "District",
      "Waiting Days",
      "Status",
      "Area (ha)",
    ];
    const rows = filteredData.map((mine) => [
      mine.name,
      mine.tipeTambang,
      mine.kabupaten,
      mine.waitingDays,
      mine.status,
      mine.luasArea,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "pending_sulteng_mines.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifySelected = () => {
    alert("Verification functionality would be implemented here");
    // In a real implementation, you would call an API to update the selected mines
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Calculate pending percentage - this would match the admin dashboard value
  const pendingPercentage = 16.9;

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
                <Input
                  placeholder="Search pending mines..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Simple select for mine type instead of dropdown with checkboxes */}
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                value={selectedMineType}
                onChange={(e) => setSelectedMineType(e.target.value)}
              >
                <option value="">All Mine Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleExport}
              >
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
              Pending Verification in Sulawesi Tengah
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                Flag All
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={handleVerifySelected}
              >
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
                <div className="text-3xl font-bold">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingPercentage}% of total mines
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
                <div className="text-3xl font-bold">{avgWaitTime} days</div>
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
                <div className="text-xl font-bold">{oldestPending} days</div>
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
                  onClick={handleVerifySelected}
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
                        {/* Replace Checkbox with a basic input type="checkbox" */}
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
                    {filteredData.map((mine) => (
                      <TableRow key={mine._id} className="hover:bg-gray-50">
                        <TableCell>
                          {/* Replace Checkbox with a basic input type="checkbox" */}
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {mine.name}
                        </TableCell>
                        <TableCell>{mine.tipeTambang}</TableCell>
                        <TableCell>{mine.waitingDays} days</TableCell>
                        <TableCell>{mine.kabupaten}</TableCell>
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
                  Showing {filteredData.length} of {pendingMines.length} pending
                  mines
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardFooter>
            </Card>

            {/* ...existing bottlenecks card... */}
          </div>
        </div>
      </div>
    </MineProvider>
  );
}
