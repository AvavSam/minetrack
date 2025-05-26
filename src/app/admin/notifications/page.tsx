import {
  ArrowLeft,
  Filter,
  Download,
  Search,
  Bell,
  BarChart,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  Trash,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MineProvider } from "@/context/MineContext";
import { Badge } from "@/components/ui/badge";

// Mock notifications data
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
  {
    id: 4,
    title: "New user registration",
    message:
      "A new operator account has been registered and requires verification.",
    type: "user",
    priority: "medium",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: 5,
    title: "Report deadline approaching",
    message:
      "Monthly environmental compliance reports are due in 3 days for 15 mines.",
    type: "reminder",
    priority: "medium",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: 6,
    title: "System update available",
    message:
      "A new system update with improved environmental monitoring features is available.",
    type: "system",
    priority: "low",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 7,
    title: "Compliance warning",
    message:
      "Central Java Granite Quarry has missed the reporting deadline. Immediate action required.",
    type: "alert",
    priority: "high",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
  },
  {
    id: 8,
    title: "New regulatory requirement",
    message:
      "New regulation KB-123/MEN/2023 requires additional water quality testing for all active mines.",
    type: "policy",
    priority: "high",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 9,
    title: "Database backup completed",
    message: "Weekly database backup has been completed successfully.",
    type: "system",
    priority: "low",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: 10,
    title: "User account locked",
    message:
      "Multiple failed login attempts detected. User account has been temporarily locked.",
    type: "user",
    priority: "medium",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  },
];

// Helper function to get time ago string
function getTimeAgo(timestamp: string) {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationTime.getTime()) / 1000
  );

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Helper function to get icon for notification type
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
    case "policy":
      return (
        <Info
          className={`h-5 w-5 ${
            priority === "high" ? "text-indigo-500" : "text-indigo-400"
          }`}
        />
      );
    default:
      return <Info className="h-5 w-5 text-gray-400" />;
  }
}

// Get counts by type
const countByType = notifications.reduce(
  (acc: Record<string, number>, notification) => {
    acc[notification.type] = (acc[notification.type] || 0) + 1;
    return acc;
  },
  {}
);

// Get counts by priority
const countByPriority = notifications.reduce(
  (acc: Record<string, number>, notification) => {
    acc[notification.priority] = (acc[notification.priority] || 0) + 1;
    return acc;
  },
  {}
);

// Get unread count
const unreadCount = notifications.filter((n) => !n.isRead).length;

export default async function NotificationsPage() {
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
              className="flex items-center hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notifications..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="approval">Approvals</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              <Bell className="mr-2 h-6 w-6 text-amber-600" />
              Notifications
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Mark All as Read
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Trash className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  All Notifications
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">
                  {notifications.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  In the last 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Priority
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">
                  {countByPriority.high || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Notifications
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {countByType.system || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Updates and maintenance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">
                  {unreadCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  New notifications
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="all">All Notifications</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="high">High Priority</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                    >
                      <BarChart className="h-3.5 w-3.5 mr-1" />
                      Analytics
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                <CardContent className="pt-6 px-0">
                  <TabsContent value="all" className="space-y-4 m-0">
                    {notifications.map((notification) =>
                      renderNotification(notification)
                    )}
                  </TabsContent>

                  <TabsContent value="unread" className="space-y-4 m-0">
                    {notifications
                      .filter((n) => !n.isRead)
                      .map((notification) => renderNotification(notification))}
                  </TabsContent>

                  <TabsContent value="high" className="space-y-4 m-0">
                    {notifications
                      .filter((n) => n.priority === "high")
                      .map((notification) => renderNotification(notification))}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Statistics</CardTitle>
                <CardDescription>
                  Distribution of notifications by type and priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">By Type</h4>
                    <div className="space-y-3">
                      {Object.entries(countByType)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center">
                            <div className="w-1/3 font-medium text-sm capitalize">
                              {type}
                            </div>
                            <div className="w-2/3">
                              <div className="flex items-center">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full ${
                                      type === "approval"
                                        ? "bg-green-500"
                                        : type === "alert"
                                        ? "bg-red-500"
                                        : type === "system"
                                        ? "bg-blue-500"
                                        : type === "reminder"
                                        ? "bg-amber-500"
                                        : type === "user"
                                        ? "bg-purple-500"
                                        : type === "policy"
                                        ? "bg-indigo-500"
                                        : "bg-gray-500"
                                    }`}
                                    style={{
                                      width: `${
                                        ((count as number) /
                                          notifications.length) *
                                        100
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
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">By Priority</h4>
                    <div className="space-y-3">
                      {Object.entries(countByPriority)
                        .sort(([a], [b]) => {
                          const order = { high: 0, medium: 1, low: 2 };
                          return (order as any)[a] - (order as any)[b];
                        })
                        .map(([priority, count]) => (
                          <div key={priority} className="flex items-center">
                            <div className="w-1/3 font-medium text-sm capitalize">
                              {priority}
                            </div>
                            <div className="w-2/3">
                              <div className="flex items-center">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full ${
                                      priority === "high"
                                        ? "bg-red-500"
                                        : priority === "medium"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{
                                      width: `${
                                        ((count as number) /
                                          notifications.length) *
                                        100
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings & Preferences</CardTitle>
                <CardDescription>
                  Customize your notification experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <div className="h-6 w-10 bg-slate-200 rounded-full relative">
                    <div className="h-6 w-6 bg-white rounded-full shadow absolute top-0 right-0 transform transition-transform"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">High Priority Only</h4>
                    <p className="text-xs text-muted-foreground">
                      Only show high priority notifications
                    </p>
                  </div>
                  <div className="h-6 w-10 bg-amber-500 rounded-full relative">
                    <div className="h-6 w-6 bg-white rounded-full shadow absolute top-0 left-0 transform transition-transform"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Auto-mark as Read</h4>
                    <p className="text-xs text-muted-foreground">
                      Automatically mark as read when viewed
                    </p>
                  </div>
                  <div className="h-6 w-10 bg-amber-500 rounded-full relative">
                    <div className="h-6 w-6 bg-white rounded-full shadow absolute top-0 left-0 transform transition-transform"></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">
                    Notification Categories
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(countByType).map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <div className="h-4 w-4 border rounded flex items-center justify-center">
                          <div className="h-2 w-2 bg-amber-500 rounded"></div>
                        </div>
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MineProvider>
  );
}

// Helper function to render a notification item
function renderNotification(notification: any) {
  return (
    <div
      key={notification.id}
      className={`flex items-start px-6 py-4 ${
        !notification.isRead ? "bg-amber-50" : ""
      } hover:bg-slate-50 border-b border-slate-100 transition-colors`}
    >
      <div className="mr-4">
        {getNotificationIcon(notification.type, notification.priority)}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4
              className={`text-sm font-medium ${
                !notification.isRead ? "text-slate-900" : "text-slate-700"
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
              className={`text-sm mt-1 ${
                !notification.isRead ? "text-slate-700" : "text-slate-500"
              }`}
            >
              {notification.message}
            </p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
            {getTimeAgo(notification.timestamp)}
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

          <Badge
            variant="outline"
            className={`capitalize ${
              notification.type === "approval"
                ? "text-green-600"
                : notification.type === "alert"
                ? "text-red-600"
                : notification.type === "system"
                ? "text-blue-600"
                : notification.type === "reminder"
                ? "text-amber-600"
                : notification.type === "user"
                ? "text-purple-600"
                : notification.type === "policy"
                ? "text-indigo-600"
                : "text-slate-600"
            }`}
          >
            {notification.type}
          </Badge>

          <div className="flex-1"></div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <CheckCircle className="h-4 w-4 text-slate-400 hover:text-green-500" />
            <span className="sr-only">Mark as read</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <Trash className="h-4 w-4 text-slate-400 hover:text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
