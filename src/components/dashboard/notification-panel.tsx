"use client"

import { AlertTriangle, CheckCircle, Clock, Info, Mountain, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Sample notification data
const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Environmental Alert",
    message: "Air quality levels near Coal Creek Mine have exceeded thresholds",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Mine Proposal",
    message: "Granite Quarry proposal has been submitted for review",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Mine Verified",
    message: "Iron Ridge Excavation has been successfully verified",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "pending",
    title: "Verification Request",
    message: "Silver Valley Mine is awaiting verification",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "User Registration",
    message: "New inspector account has been created",
    time: "1 day ago",
    read: true,
  },
]

export function NotificationPanel() {
  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Mountain className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Notifications</h3>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex gap-3 rounded-lg border p-3 text-sm",
              notification.read ? "bg-background" : "bg-muted/50",
            )}
          >
            <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              <p className="text-muted-foreground">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="w-full">
          View All Notifications
        </Button>
      </div>
    </div>
  )
}

