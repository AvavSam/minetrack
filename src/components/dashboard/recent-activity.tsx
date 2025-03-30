"use client"

import { CheckCircle, Clock, Edit, FileText, Mountain, User } from "lucide-react"

// Sample activity data
const activities = [
  {
    id: 1,
    type: "mine_added",
    user: "John Doe",
    target: "Limestone Excavation",
    time: "15 minutes ago",
  },
  {
    id: 2,
    type: "mine_verified",
    user: "Sarah Johnson",
    target: "Iron Ridge Excavation",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "mine_updated",
    user: "Michael Chen",
    target: "Golden Peak Mine",
    time: "4 hours ago",
  },
  {
    id: 4,
    type: "document_added",
    user: "Lisa Wong",
    target: "Environmental Impact Assessment",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "user_added",
    user: "Admin",
    target: "New Field Inspector",
    time: "2 days ago",
  },
]

export function RecentActivityList() {
  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mine_added":
        return <Mountain className="h-5 w-5 text-blue-500" />
      case "mine_verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "mine_updated":
        return <Edit className="h-5 w-5 text-amber-500" />
      case "document_added":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "user_added":
        return <User className="h-5 w-5 text-indigo-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Function to get the activity description
  const getActivityDescription = (activity: (typeof activities)[0]) => {
    switch (activity.type) {
      case "mine_added":
        return `added a new mine: ${activity.target}`
      case "mine_verified":
        return `verified mine: ${activity.target}`
      case "mine_updated":
        return `updated mine details: ${activity.target}`
      case "document_added":
        return `uploaded document: ${activity.target}`
      case "user_added":
        return `added new user: ${activity.target}`
      default:
        return `performed action on ${activity.target}`
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3 text-sm">
          <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
          <div className="space-y-1">
            <p>
              <span className="font-medium">{activity.user}</span> {getActivityDescription(activity)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

