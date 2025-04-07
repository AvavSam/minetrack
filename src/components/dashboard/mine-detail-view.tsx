"use client"

import { useState } from "react"
import { CheckCircle, Clock, MapPin, Wind } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherWidget } from "./weather-widget"
import { AirQualityWidget } from "./air-quality-widget"

interface MineDetailViewProps {
  mine: {
    id: number
    name: string
    type: string
    location: string
    status: string
    licenseStatus: string
    verified: boolean
    lastUpdated: string
  }
}

export function MineDetailView({ mine }: MineDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the mine details
  const mineDetails = {
    description:
      "This is a large-scale mining operation focused on sustainable extraction practices with minimal environmental impact. The mine implements water recycling systems and has a comprehensive rehabilitation program.",
    coordinates: { lat: -6.175, lng: 106.865 },
    area: "245 hectares",
    depth: "120 meters",
    owner: "PT Mining Sustainable Indonesia",
    startDate: "2018-05-12",
    permitExpiry: "2028-05-12",
    environmentalRating: "B+",
    rehabilitationPlan: "Yes",
    waterManagement: "Closed-loop recycling system",
    wasteManagement: "On-site processing and containment",
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold">{mine.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {mine.location}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={mine.verified ? "default" : "outline"} className="flex items-center gap-1">
            {mine.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {mine.verified ? "Verified" : "Pending Verification"}
          </Badge>
          <Badge
            variant={
              mine.licenseStatus === "Valid"
                ? "default"
                : mine.licenseStatus === "Pending"
                  ? "outline"
                  : mine.licenseStatus === "Expiring"
                    ? "secondary"
                    : "destructive"
            }
          >
            License: {mine.licenseStatus}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Data</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mine Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{mineDetails.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="text-sm">
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{mine.type}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Area</p>
                      <p className="text-muted-foreground">{mineDetails.area}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Depth</p>
                      <p className="text-muted-foreground">{mineDetails.depth}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Owner</p>
                      <p className="text-muted-foreground">{mineDetails.owner}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Start Date</p>
                      <p className="text-muted-foreground">{mineDetails.startDate}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Permit Expiry</p>
                      <p className="text-muted-foreground">{mineDetails.permitExpiry}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Weather Conditions</CardTitle>
                  <CardDescription>Current weather at mine location</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeatherWidget />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Air Quality</CardTitle>
                  <CardDescription>Current air quality measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <AirQualityWidget />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Environmental Rating</p>
                  <p className="text-sm text-muted-foreground">{mineDetails.environmentalRating}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rehabilitation Plan</p>
                  <p className="text-sm text-muted-foreground">{mineDetails.rehabilitationPlan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Water Management</p>
                  <p className="text-sm text-muted-foreground">{mineDetails.waterManagement}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Waste Management</p>
                  <p className="text-sm text-muted-foreground">{mineDetails.wasteManagement}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Edit Details</Button>
            {!mine.verified && <Button>Verify Mine</Button>}
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Monitoring</CardTitle>
              <CardDescription>Historical and current environmental data for this mine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Wind className="mr-2 h-4 w-4" />
                Environmental data visualization coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Permits</CardTitle>
              <CardDescription>Legal documents and permits related to this mine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                Document management system coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Timeline of events and changes for this mine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                Activity timeline coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

