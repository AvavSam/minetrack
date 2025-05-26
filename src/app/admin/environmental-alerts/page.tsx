import {
  AlertTriangle,
  ArrowLeft,
  Filter,
  Download,
  Search,
  Check,
  X,
  BarChart,
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
import { MineProvider } from "@/context/MineContext";
import { Badge } from "@/components/ui/badge";
import { getTambangTerverifikasi } from "@/lib/tambang";

// Mock environmental alerts data
const alerts = [
  {
    id: 1,
    type: "Water Contamination",
    severity: "high",
    location: "Sukabumi Quarry",
    province: "West Java",
    date: "2023-06-15",
    status: "active",
    description:
      "Elevated levels of heavy metals detected in water samples near the quarry.",
  },
  {
    id: 2,
    type: "Land Subsidence",
    severity: "high",
    location: "Kaltim Coal Mine",
    province: "East Kalimantan",
    date: "2023-06-10",
    status: "active",
    description: "Significant land subsidence detected near mining operations.",
  },
  {
    id: 3,
    type: "Dust Emissions",
    severity: "medium",
    location: "Central Java Limestone",
    province: "Central Java",
    date: "2023-06-08",
    status: "active",
    description:
      "Elevated particulate matter levels recorded near quarry operations.",
  },
  {
    id: 4,
    type: "Deforestation",
    severity: "medium",
    location: "Papua Gold Mine",
    province: "Papua",
    date: "2023-06-05",
    status: "active",
    description:
      "Unauthorized clearing of protected forest area near mining site.",
  },
  {
    id: 5,
    type: "Water Contamination",
    severity: "medium",
    location: "Bangka Tin Mine",
    province: "Bangka Belitung",
    date: "2023-06-03",
    status: "resolved",
    description: "Acid mine drainage affecting local water sources.",
  },
  {
    id: 6,
    type: "Air Quality",
    severity: "low",
    location: "South Sumatra Coal",
    province: "South Sumatra",
    date: "2023-06-01",
    status: "active",
    description: "Sulfur dioxide emissions exceeding recommended levels.",
  },
  {
    id: 7,
    type: "Soil Erosion",
    severity: "low",
    location: "West Papua Nickel",
    province: "West Papua",
    date: "2023-05-28",
    status: "resolved",
    description: "Significant soil erosion affecting agricultural land nearby.",
  },
];

// Count alerts by severity
const countBySeverity = {
  high: alerts.filter((a) => a.severity === "high" && a.status === "active")
    .length,
  medium: alerts.filter((a) => a.severity === "medium" && a.status === "active")
    .length,
  low: alerts.filter((a) => a.severity === "low" && a.status === "active")
    .length,
  resolved: alerts.filter((a) => a.status === "resolved").length,
};

// Count alerts by type
const countByType = alerts.reduce((acc: any, alert) => {
  acc[alert.type] = (acc[alert.type] || 0) + 1;
  return acc;
}, {});

export default async function EnvironmentalAlertsPage() {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Get mine data to link alerts to actual mines
  const tambangData = await getTambangTerverifikasi({});

  // Active alerts
  const activeAlerts = alerts.filter((a) => a.status === "active");

  return (
    <MineProvider>
      <div className="flex flex-col min-h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/admin"
              className="flex items-center hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search alerts..." className="pl-8" />
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
              <AlertTriangle className="mr-2 h-6 w-6 text-red-600" />
              Environmental Alerts
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-blue-500" />
                Generate Report
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Escalate Selected
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50 rounded-t-lg">
                <CardTitle className="text-sm font-medium">
                  High Severity
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-red-600">
                  {countBySeverity.high}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 rounded-t-lg">
                <CardTitle className="text-sm font-medium">
                  Medium Severity
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-amber-600">
                  {countBySeverity.medium}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Should be addressed within 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 rounded-t-lg">
                <CardTitle className="text-sm font-medium">
                  Low Severity
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-blue-600">
                  {countBySeverity.low}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitoring required
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 rounded-t-lg">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold text-green-600">
                  {countBySeverity.resolved}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  In the last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Active Environmental Alerts</CardTitle>
                <CardDescription>
                  Issues requiring attention across mining operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Issue Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          #{alert.id}
                        </TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>
                          {alert.location}
                          <div className="text-xs text-muted-foreground">
                            {alert.province}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(alert.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              alert.severity === "high"
                                ? "bg-red-500"
                                : alert.severity === "medium"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }
                          >
                            {alert.severity.charAt(0).toUpperCase() +
                              alert.severity.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Resolve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span className="sr-only">Escalate</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              <span className="sr-only">More</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {activeAlerts.length} active alerts
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution</CardTitle>
                <CardDescription>
                  Environmental issues by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(countByType).map(
                    ([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center">
                        <div className="w-1/2 font-medium text-sm">{type}</div>
                        <div className="w-1/2">
                          <div className="flex items-center">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-red-500 rounded-full"
                                style={{
                                  width: `${(count / alerts.length) * 100}%`,
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

                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Alert Trends</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>This month</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">19</span>
                        <span className="text-red-500 text-xs flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3 mr-0.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                              clipRule="evenodd"
                            />
                          </svg>
                          18%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Last month</span>
                      <span className="font-medium">16</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Resolution rate</span>
                      <span className="font-medium text-green-600">65%</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                      </svg>
                      Detailed Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alert Details</CardTitle>
              <CardDescription>
                Comprehensive information about the latest environmental issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-red-800">
                      Water Contamination at Sukabumi Quarry
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Elevated levels of heavy metals detected in water samples
                      near the quarry, including lead (0.03 mg/L) and arsenic
                      (0.015 mg/L) exceeding safety standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Alert Information
                  </h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Date Reported:</dt>
                    <dd className="font-medium">June 15, 2023</dd>

                    <dt className="text-gray-500">Location:</dt>
                    <dd className="font-medium">Sukabumi Quarry, West Java</dd>

                    <dt className="text-gray-500">Reporter:</dt>
                    <dd className="font-medium">Environmental Inspector</dd>

                    <dt className="text-gray-500">Severity:</dt>
                    <dd className="font-medium text-red-600">High</dd>

                    <dt className="text-gray-500">Status:</dt>
                    <dd className="font-medium">Active</dd>

                    <dt className="text-gray-500">Affected Area:</dt>
                    <dd className="font-medium">3.5 km²</dd>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Immediate suspension of quarry operations</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Water sampling at 5 additional downstream locations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Notify local communities and health authorities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Implement emergency water filtration measures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Take Action
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MineProvider>
  );
}
