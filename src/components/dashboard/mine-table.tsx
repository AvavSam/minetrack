"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, Download, Edit, MoreHorizontal, Plus, Search, Trash2, Loader2, RefreshCw, AlertCircle } from "lucide-react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the Mine type
interface Mine {
  id: string
  name: string
  type: string
  location: string
  status: string
  licenseStatus: string
  verified: boolean
  lastUpdated: string
}

export function MineTable() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")

  // State for mine data and UI
  const [mines, setMines] = useState<Mine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMine, setSelectedMine] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch mines data from API
  const fetchMines = async () => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Build URL with filter parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (verificationFilter !== "all") params.append("verification", verificationFilter)

      const response = await fetch(`/api/mines?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error fetching mines: ${response.status}`)
      }

      const data = await response.json()
      setMines(data)
    } catch (err) {
      console.error("Failed to fetch mines:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch mines data")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Fetch mines when component mounts or filters change
  useEffect(() => {
    // Debounce search to avoid too many requests
    const handler = setTimeout(() => {
      fetchMines()
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, typeFilter, statusFilter, verificationFilter])

  const handleViewDetails = (id: string) => {
    setSelectedMine(id)
    setIsDetailOpen(true)
  }

  const selectedMineData = mines.find((mine) => mine.id === selectedMine)

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true)
    fetchMines()
  }

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
              <SelectItem value="emas">Emas</SelectItem>
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

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>License Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Loading mines...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : mines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No mines found.
                </TableCell>
              </TableRow>
            ) : (
              mines.map((mine) => (
                <TableRow key={mine.id}>
                  <TableCell className="font-medium">{mine.name}</TableCell>
                  <TableCell>{mine.type}</TableCell>
                  <TableCell className="max-w-96 truncate">{mine.location}</TableCell>
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
          {selectedMineData && <MineDetailView mine={{ ...selectedMineData, id: parseInt(selectedMineData.id) }} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
