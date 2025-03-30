"use client"

import { useState } from "react"
import { CheckCircle, Clock, Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MineDetailView } from "./mine-detail-view"

// Sample mine data
const mines = [
  {
    id: 1,
    name: "Copper Mountain Mine",
    type: "Copper",
    location: "East Java",
    status: "Active",
    licenseStatus: "Valid",
    verified: true,
    lastUpdated: "2023-10-15",
  },
  {
    id: 2,
    name: "Golden Peak Mine",
    type: "Gold",
    location: "West Sumatra",
    status: "Active",
    licenseStatus: "Valid",
    verified: true,
    lastUpdated: "2023-09-28",
  },
  {
    id: 3,
    name: "Silver Valley Mine",
    type: "Silver",
    location: "Central Java",
    status: "Pending",
    licenseStatus: "Pending",
    verified: false,
    lastUpdated: "2023-11-02",
  },
  {
    id: 4,
    name: "Iron Ridge Excavation",
    type: "Iron",
    location: "South Kalimantan",
    status: "Active",
    licenseStatus: "Valid",
    verified: true,
    lastUpdated: "2023-10-05",
  },
  {
    id: 5,
    name: "Coal Creek Mine",
    type: "Coal",
    location: "East Kalimantan",
    status: "Pending",
    licenseStatus: "Pending",
    verified: false,
    lastUpdated: "2023-11-10",
  },
  {
    id: 6,
    name: "Emerald Valley Mine",
    type: "Gemstone",
    location: "North Sumatra",
    status: "Active",
    licenseStatus: "Expiring",
    verified: true,
    lastUpdated: "2023-08-22",
  },
  {
    id: 7,
    name: "Granite Quarry",
    type: "Stone",
    location: "West Java",
    status: "Active",
    licenseStatus: "Valid",
    verified: true,
    lastUpdated: "2023-09-15",
  },
  {
    id: 8,
    name: "Limestone Excavation",
    type: "Stone",
    location: "Central Sulawesi",
    status: "Pending",
    licenseStatus: "Pending",
    verified: false,
    lastUpdated: "2023-11-05",
  },
]

export function MineTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [selectedMine, setSelectedMine] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter mines based on search and filters
  const filteredMines = mines.filter((mine) => {
    const matchesSearch =
      mine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mine.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || mine.type === typeFilter
    const matchesStatus = statusFilter === "all" || mine.licenseStatus === statusFilter
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && mine.verified) ||
      (verificationFilter === "pending" && !mine.verified)

    return matchesSearch && matchesType && matchesStatus && matchesVerification
  })

  const handleViewDetails = (id: number) => {
    setSelectedMine(id)
    setIsDetailOpen(true)
  }

  const selectedMineData = mines.find((mine) => mine.id === selectedMine)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mines..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Mine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Copper">Copper</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Iron">Iron</SelectItem>
              <SelectItem value="Coal">Coal</SelectItem>
              <SelectItem value="Gemstone">Gemstone</SelectItem>
              <SelectItem value="Stone">Stone</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="License Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Valid">Valid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Expiring">Expiring</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button className="ml-auto" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Mine
          </Button>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>License Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No mines found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMines.map((mine) => (
                <TableRow key={mine.id}>
                  <TableCell className="font-medium">{mine.name}</TableCell>
                  <TableCell>{mine.type}</TableCell>
                  <TableCell>{mine.location}</TableCell>
                  <TableCell>
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
                      {mine.licenseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mine.verified ? "default" : "outline"} className="flex w-fit items-center gap-1">
                      {mine.verified ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {mine.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{mine.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(mine.id)}>View details</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!mine.verified && (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Mine Details</DialogTitle>
            <DialogDescription>Detailed information about the selected mine</DialogDescription>
          </DialogHeader>
          {selectedMineData && <MineDetailView mine={selectedMineData} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

