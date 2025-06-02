"use client"

import { useState } from "react"
import { CheckCircle, Clock, MapPin, Wind } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mine } from "@/types/mine";

export function MineDetailView({ mine }: { mine: Mine }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold">{mine.namaTambang}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {mine.koordinat ? `${mine.koordinat.lat.toFixed(2)}, ${mine.koordinat.lng.toFixed(2)}` : "Location data unavailable"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={mine.verifikasi ? "default" : "outline"} className="flex items-center gap-1">
            {mine.verifikasi ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {mine.verifikasi ? "Verified" : "Pending Verification"}
          </Badge>
          <Badge variant={mine.lisensi === "valid" ? "default" : mine.lisensi === "pending" ? "outline" : mine.lisensi === "expiring" ? "secondary" : "destructive"}>License: {mine.lisensi}</Badge>
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
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mine Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{mine.deskripsi}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="text-sm">
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{mine.tipeTambang}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <div className="flex items-center justify-center p-8 text-muted-foreground">Document management system coming soon</div>
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
              <div className="flex items-center justify-center p-8 text-muted-foreground">Activity timeline coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
