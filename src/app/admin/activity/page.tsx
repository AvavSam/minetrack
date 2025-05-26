import {
  ArrowLeft,
  Filter,
  Download,
  Search,
  RefreshCw,
  UserCircle,
  CheckCircle,
  Pencil,
  Trash2,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MineProvider } from "@/context/MineContext";
import { Badge } from "@/components/ui/badge";

// Mock activity data
const activityLogs = [
  {
    id: 1,
    adminId: "user123",
    adminName: "John Admin",
    action: "approve",
    targetType: "mine",
    targetId: "mine456",
    targetName: "East Kalimantan Coal Mine",
    details: "Approved mine registration after document verification",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 2,
    adminId: "user123",
    adminName: "John Admin",
    action: "edit",
    targetType: "mine",
    targetId: "mine789",
    targetName: "West Java Limestone Quarry",
    details: "Updated location coordinates and production capacity",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    adminId: "user456",
    adminName: "Sarah Manager",
    action: "delete",
    targetType: "user",
    targetId: "user789",
    targetName: "Duplicate Account",
    details: "Removed duplicate user account",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 4,
    adminId: "user456",
    adminName: "Sarah Manager",
    action: "warn",
    targetType: "mine",
    targetId: "mine101",
    targetName: "Papua Gold Mine",
    details: "Issued warning for environmental non-compliance",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: 5,
    adminId: "user789",
    adminName: "Mike Supervisor",
    action: "approve",
    targetType: "report",
    targetId: "report123",
    targetName: "Monthly Compliance Report",
    details: "Approved environmental compliance report",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 6,
    adminId: "user123",
    adminName: "John Admin",
    action: "edit",
    targetType: "user",
    targetId: "user321",
    targetName: "Mine Operator Account",
    details: "Updated user role from viewer to operator",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
  },
  {
    id: 7,
    adminId: "user456",
    adminName: "Sarah Manager",
    action: "warn",
    targetType: "mine",
    targetId: "mine202",
    targetName: "Central Java Granite Quarry",
    details: "Issued warning for late reporting",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28 hours ago
  },
  {
    id: 8,
    adminId: "user789",
    adminName: "Mike Supervisor",
    action: "delete",
    targetType: "report",
    targetId: "report456",
    targetName: "Duplicate Report Entry",
    details: "Removed duplicate environmental report",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 9,
    adminId: "user123",
    adminName: "John Admin",
    action: "approve",
    targetType: "mine",
    targetId: "mine303",
    targetName: "South Sumatra Coal Mine",
    details: "Approved mine registration after site inspection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: 10,
    adminId: "user456",
    adminName: "Sarah Manager",
    action: "edit",
    targetType: "mine",
    targetId: "mine404",
    targetName: "Bangka Tin Mine",
    details: "Updated operational status to active",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  },
];

// Helper function to get time ago string
function getTimeAgo(timestamp: string) {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - activityTime.getTime()) / 1000
  );

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Helper function to get icon for action type
function getActionIcon(action: string) {
  switch (action) {
    case "approve":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "edit":
      return <Pencil className="h-5 w-5 text-blue-500" />;
    case "delete":
      return <Trash2 className="h-5 w-5 text-red-500" />;
    case "warn":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    default:
      return <CheckCircle className="h-5 w-5 text-gray-500" />;
  }
}

// Count activities by type
const countByAction = activityLogs.reduce(
  (acc: Record<string, number>, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  },
  {}
);

export default async function ActivityPage() {
  // Verify admin role on the server side
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <MineProvider>
      <div className="flex flex-col min-h-screen">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/admin"
              className="flex items-center hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activities..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approve">Approvals</SelectItem>
                  <SelectItem value="edit">Edits</SelectItem>
                  <SelectItem value="delete">Deletions</SelectItem>
                  <SelectItem value="warn">Warnings</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
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
              <RefreshCw className="mr-2 h-6 w-6 text-violet-600" />
              Recent Activity
            </h2>
            <Button className="bg-violet-600 hover:bg-violet-700">
              Refresh
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approvals</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">
                  {countByAction.approve || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mines and reports approved
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edits</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Pencil className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {countByAction.edit || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Records and data updated
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deletions</CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">
                  {countByAction.delete || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Removed items
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">
                  {countByAction.warn || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Issues flagged
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Complete history of admin actions and system changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="mt-0.5">{getActionIcon(log.action)}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        <span className="text-violet-600">{log.adminName}</span>
                        <span>
                          {" "}
                          {log.action === "approve"
                            ? "approved"
                            : log.action === "edit"
                            ? "edited"
                            : log.action === "delete"
                            ? "deleted"
                            : "warned"}{" "}
                          a {log.targetType}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {getTimeAgo(log.timestamp)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm">
                      <span className="font-medium">{log.targetName}</span>
                      {log.details && (
                        <span className="text-slate-600"> - {log.details}</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center space-x-2">
                      <Badge
                        className={
                          log.action === "approve"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : log.action === "edit"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : log.action === "delete"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }
                      >
                        {log.action.charAt(0).toUpperCase() +
                          log.action.slice(1)}
                      </Badge>

                      <Badge variant="outline" className="text-slate-600">
                        {log.targetType.charAt(0).toUpperCase() +
                          log.targetType.slice(1)}
                      </Badge>

                      <Badge variant="outline" className="text-slate-600">
                        ID: {log.targetId}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">
                Showing {activityLogs.length} of {activityLogs.length}{" "}
                activities
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Activity Overview</CardTitle>
              <CardDescription>
                Statistics on admin actions and frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Activity by Admin
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(
                      activityLogs.reduce(
                        (acc: Record<string, number>, log) => {
                          acc[log.adminName] = (acc[log.adminName] || 0) + 1;
                          return acc;
                        },
                        {}
                      )
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, count]) => (
                        <div key={name} className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <UserCircle className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">
                                {name}
                              </p>
                              <p className="text-sm font-medium">{count}</p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-violet-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (count / activityLogs.length) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Activity Timeline
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Today</span>
                      <span className="font-medium">
                        {
                          activityLogs.filter((log) => {
                            const date = new Date(log.timestamp);
                            const today = new Date();
                            return (
                              date.getDate() === today.getDate() &&
                              date.getMonth() === today.getMonth() &&
                              date.getFullYear() === today.getFullYear()
                            );
                          }).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Yesterday</span>
                      <span className="font-medium">
                        {
                          activityLogs.filter((log) => {
                            const date = new Date(log.timestamp);
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            return (
                              date.getDate() === yesterday.getDate() &&
                              date.getMonth() === yesterday.getMonth() &&
                              date.getFullYear() === yesterday.getFullYear()
                            );
                          }).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>This Week</span>
                      <span className="font-medium">
                        {
                          activityLogs.filter((log) => {
                            const date = new Date(log.timestamp);
                            const now = new Date();
                            const weekStart = new Date(now);
                            weekStart.setDate(now.getDate() - now.getDay());
                            return date >= weekStart;
                          }).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-medium">{activityLogs.length}</span>
                    </div>

                    <div className="pt-4 border-t mt-4">
                      <h4 className="text-sm font-medium mb-3">
                        Most Common Actions
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(countByAction)
                          .sort(([, a], [, b]) => b - a)
                          .map(([action, count]) => (
                            <div key={action} className="flex items-center">
                              <div className="mr-2">
                                {getActionIcon(action)}
                              </div>
                              <div>
                                <p className="text-sm font-medium capitalize">
                                  {action}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {count} activities
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MineProvider>
  );
}
