"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Download, Pencil, Edit, MoreHorizontal, Plus, Search, Trash2, Loader2, RefreshCw, AlertCircle, Eye, MapPin, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MineDetailView } from "./mine-detail-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Define the Mine type
interface Mine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  licenseStatus: string;
  verified: boolean;
  lastUpdated: string;
}

export function MineTable() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  // State for mine data and UI
  const [mines, setMines] = useState<Mine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMine, setSelectedMine] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add these state variables
  const [editLicenseStatus, setEditLicenseStatus] = useState<string | null>(null);
  const [editVerification, setEditVerification] = useState<boolean | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch mines data from API
  const fetchMines = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      // Build URL with filter parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (verificationFilter !== "all") params.append("verification", verificationFilter);

      const response = await fetch(`/api/mines?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error fetching mines: ${response.status}`);
      }

      const data = await response.json();
      setMines(data);
    } catch (err) {
      console.error("Failed to fetch mines:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch mines data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch mines when component mounts or filters change
  useEffect(() => {
    // Debounce search to avoid too many requests
    const handler = setTimeout(() => {
      fetchMines();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, statusFilter, verificationFilter]);

  const handleViewDetails = (id: string) => {
    setSelectedMine(id);
    setIsDetailOpen(true);
  };

  const selectedMineData = mines.find((mine) => mine.id === selectedMine);

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    fetchMines();
  };

  // State for add mine modal
  const [isAddMineOpen, setIsAddMineOpen] = useState(false);

  // Reset edit states when dialog opens/closes or mine changes
  useEffect(() => {
    if (selectedMine && selectedMineData) {
      setEditLicenseStatus(selectedMineData.licenseStatus);
      setEditVerification(selectedMineData.verified);
    } else {
      setEditLicenseStatus(null);
      setEditVerification(null);
    }
  }, [selectedMine, selectedMineData]);

  // Function to handle saving changes
  const handleSaveChanges = async () => {
    if (!selectedMineData) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/mines/${selectedMineData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseStatus: editLicenseStatus,
          verified: editVerification,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update mine");
      }

      // Update the local data
      setMines(
        mines.map((mine) =>
          mine.id === selectedMineData.id
            ? {
                ...mine,
                licenseStatus: editLicenseStatus || mine.licenseStatus,
                verified: editVerification !== null ? editVerification : mine.verified,
              }
            : mine
        )
      );

      // Close the dialog
      setIsDetailOpen(false);

      // Show success toast
      toast.success("The mine has been successfully updated.");
    } catch (error) {
      console.error("Error updating mine:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update mine");
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to handle mine deletion
  const handleDeleteMine = async () => {
    if (!selectedMineData) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mines/${selectedMineData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete mine");
      }

      // Remove from local state
      setMines(mines.filter((mine) => mine.id !== selectedMineData.id));

      // Close both dialogs
      setIsDeleteConfirmOpen(false);
      setIsDetailOpen(false);

      // Show success toast
      toast.success("The mine has been permanently deleted.");
    } catch (error) {
      console.error("Error deleting mine:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete mine");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search mines..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
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

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
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
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">License Status</TableHead>
              <TableHead className="font-semibold">Verification</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
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
                  <div className="flex flex-col items-center justify-center space-y-3 py-4">
                    <div className="rounded-full bg-background p-3">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">No mines found</p>
                      <p className="text-sm text-muted-foreground">Add a new mine or adjust your filters</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setIsAddMineOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Mine
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              mines.map((mine) => (
                <TableRow key={mine.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[180px]" title={mine.name}>
                      {mine.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{mine.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[200px]" title={mine.location}>
                      {mine.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={mine.licenseStatus === "Valid" ? "default" : mine.licenseStatus === "Pending" ? "outline" : mine.licenseStatus === "Expiring" ? "secondary" : "destructive"}
                      className={mine.licenseStatus === "Valid" ? "bg-green-500" : mine.licenseStatus === "Expiring" ? "bg-amber-500" : mine.licenseStatus === "Expired" ? "bg-red-500" : ""}
                    >
                      {mine.licenseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mine.verified ? "default" : "outline"} className={`flex w-fit items-center gap-1 ${mine.verified ? "bg-blue-500" : ""}`}>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(mine.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedMine(mine.id);
                            setIsDetailOpen(false);
                            setIsDeleteConfirmOpen(true);
                          }}
                        >
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            {/* This will be accessible to screen readers but not visible */}
            <DialogTitle>{selectedMineData ? `Mine Details: ${selectedMineData.name}` : "Mine Details"}</DialogTitle>
          </DialogHeader>

          {selectedMineData && (
            <div className="flex flex-col h-full">
              <div className="bg-primary/10 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMineData.name}</h2>
                  </div>
                  <Badge
                    variant={selectedMineData.licenseStatus === "Valid" ? "default" : "outline"}
                    className={`${selectedMineData.licenseStatus === "Valid" ? "bg-green-500 hover:bg-green-600" : selectedMineData.licenseStatus === "Pending" ? "border-yellow-400 text-yellow-700 bg-yellow-50" : ""} text-sm py-1`}
                  >
                    {selectedMineData.licenseStatus}
                  </Badge>
                </div>
              </div>

              <div className="p-6 overflow-auto">
                <div className="grid md:grid-cols-1 gap-6">
                  {/* Basic information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mine Information</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{selectedMineData.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Verification Status</p>
                          <div className="flex items-center gap-1">
                            {selectedMineData.verified ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Verified</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{selectedMineData.lastUpdated}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Identifier</p>
                          <p className="font-mono text-xs">{selectedMineData.id}</p>
                        </div>
                      </div>

                    </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{selectedMineData.location || "No description available."}</p>
                      </div>

                    {/* Add status management section */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-semibold mb-3">Status Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* License Status */}
                        <div>
                          <label className="text-sm font-medium mb-1 block">License Status</label>
                          <Select value={editLicenseStatus || selectedMineData.licenseStatus} onValueChange={setEditLicenseStatus}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select license status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Valid">Valid</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Expiring">Expiring</SelectItem>
                              <SelectItem value="Expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Verification Status */}
                        <div>
                          <label className="text-sm font-medium mb-1 block">Verification Status</label>
                          <Select value={editVerification === true ? "verified" : "pending"} onValueChange={(value) => setEditVerification(value === "verified")}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select verification status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with actions */}
              <div className="border-t p-4 bg-muted/30 mt-auto">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Last updated: {selectedMineData.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsDeleteConfirmOpen(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Mine
                    </Button>
                    <Button size="sm" onClick={handleSaveChanges} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Mine</DialogTitle>
            <DialogDescription>Are you sure you want to delete this mine? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium text-muted-foreground">
              Mine to be deleted: <span className="font-bold text-foreground">{selectedMineData?.name}</span>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMine} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Mine"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
