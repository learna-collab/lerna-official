"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/app/store/auth-store";
import { MarketplaceAdminService } from "@/app/services/vendor-admin.service";

interface Vendor {
  id: string;
  user_id: string;
  vendor_type: "INDIVIDUAL" | "BUSINESS";
  store_name: string;
  business_name?: string | null;
  slug: string;
  description?: string | null;
  phone?: string | null;
  public_email?: string | null;
  address?: string | null;
  logo_url?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  is_active: boolean;
}

type VendorStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

const statusMeta: Record<
  Exclude<VendorStatus, "ALL">,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
  },
  APPROVED: {
    label: "Approved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
  },
  SUSPENDED: {
    label: "Suspended",
    className:
      "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100",
  },
};

function StatusBadge({ status }: { status: Vendor["status"] }) {
  const meta = statusMeta[status];

  return (
    <Badge variant="outline" className={`font-medium ${meta.className}`}>
      {status === "APPROVED" && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}

      {status === "PENDING" && <Loader2 className="mr-1.5 h-3.5 w-3.5" />}

      {status === "REJECTED" && <XCircle className="mr-1.5 h-3.5 w-3.5" />}

      {status === "SUSPENDED" && <ShieldOff className="mr-1.5 h-3.5 w-3.5" />}

      {meta.label}
    </Badge>
  );
}

export default function MarketplaceVendorsPage() {
  const { user, hydrated, isLoading } = useAuthStore();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<VendorStatus>("ALL");

  const [search, setSearch] = useState("");

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const loadVendors = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MarketplaceAdminService.getVendors(
        statusFilter === "ALL" ? undefined : statusFilter,
      );

      setVendors(data ?? []);
    } catch (error) {
      console.error("Failed to load marketplace vendors:", error);

      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!hydrated || isLoading) {
      return;
    }

    if (!user) {
      return;
    }

    if (user.role !== "SUPER_ADMIN") {
      return;
    }

    Promise.resolve().then(() => loadVendors());
  }, [hydrated, isLoading, user, loadVendors]);

  const filteredVendors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return vendors;
    }

    return vendors.filter((vendor) => {
      return (
        vendor.store_name?.toLowerCase().includes(normalizedSearch) ||
        vendor.business_name?.toLowerCase().includes(normalizedSearch) ||
        vendor.public_email?.toLowerCase().includes(normalizedSearch) ||
        vendor.phone?.toLowerCase().includes(normalizedSearch) ||
        vendor.slug?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [vendors, search]);

  const summary = useMemo(() => {
    return {
      total: vendors.length,
      pending: vendors.filter((vendor) => vendor.status === "PENDING").length,
      approved: vendors.filter((vendor) => vendor.status === "APPROVED").length,
      rejected: vendors.filter((vendor) => vendor.status === "REJECTED").length,
      suspended: vendors.filter((vendor) => vendor.status === "SUSPENDED")
        .length,
    };
  }, [vendors]);

  async function handleApprove(vendor: Vendor) {
    setActionLoading(vendor.id);

    try {
      const updated = await MarketplaceAdminService.approveVendor(vendor.id);

      setVendors((current) =>
        current.map((item) => (item.id === vendor.id ? updated : item)),
      );

      setSelectedVendor((current) =>
        current?.id === vendor.id ? updated : current,
      );

      toast.success(`${vendor.store_name} has been approved`);
    } catch (error) {
      console.error("Failed to approve vendor:", error);

      toast.error("Failed to approve vendor");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(vendor: Vendor) {
    setActionLoading(vendor.id);

    try {
      const updated = await MarketplaceAdminService.rejectVendor(vendor.id);

      setVendors((current) =>
        current.map((item) => (item.id === vendor.id ? updated : item)),
      );

      setSelectedVendor((current) =>
        current?.id === vendor.id ? updated : current,
      );

      toast.success(`${vendor.store_name} has been rejected`);
    } catch (error) {
      console.error("Failed to reject vendor:", error);

      toast.error("Failed to reject vendor");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSuspend(vendor: Vendor) {
    setActionLoading(vendor.id);

    try {
      const updated = await MarketplaceAdminService.suspendVendor(vendor.id);

      setVendors((current) =>
        current.map((item) => (item.id === vendor.id ? updated : item)),
      );

      setSelectedVendor((current) =>
        current?.id === vendor.id ? updated : current,
      );

      toast.success(`${vendor.store_name} has been suspended`);
    } catch (error) {
      console.error("Failed to suspend vendor:", error);

      toast.error("Failed to suspend vendor");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivate(vendor: Vendor) {
    setActionLoading(vendor.id);

    try {
      const updated = await MarketplaceAdminService.reactivateVendor(vendor.id);

      setVendors((current) =>
        current.map((item) => (item.id === vendor.id ? updated : item)),
      );

      setSelectedVendor((current) =>
        current?.id === vendor.id ? updated : current,
      );

      toast.success(`${vendor.store_name} has been reactivated`);
    } catch (error) {
      console.error("Failed to reactivate vendor:", error);

      toast.error("Failed to reactivate vendor");
    } finally {
      setActionLoading(null);
    }
  }

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShieldOff className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">Access denied</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You do not have permission to manage marketplace vendors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />

              <h1 className="text-2xl font-bold tracking-tight">
                Marketplace Vendors
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage vendors registered on the marketplace.
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={loadVendors} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total vendors</p>

            <p className="mt-2 text-2xl font-bold">{summary.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pending</p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {summary.pending}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Approved</p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {summary.approved}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Rejected</p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {summary.rejected}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Suspended</p>

            <p className="mt-2 text-2xl font-bold">{summary.suspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vendors, stores, email or phone..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as VendorStatus)}
            >
              <SelectTrigger className="w-full md:w-[190px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All vendors</SelectItem>

                <SelectItem value="PENDING">Pending</SelectItem>

                <SelectItem value="APPROVED">Approved</SelectItem>

                <SelectItem value="REJECTED">Rejected</SelectItem>

                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendor list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendors</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <Store className="h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">No vendors found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                There are no vendors matching the current search and status
                filters.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredVendors.map((vendor) => {
                const busy = actionLoading === vendor.id;

                return (
                  <div
                    key={vendor.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                        {vendor.logo_url ? (
                          <img
                            src={vendor.logo_url}
                            alt={vendor.store_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold">
                            {vendor.store_name}
                          </h3>

                          <StatusBadge status={vendor.status} />
                        </div>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span>
                            {vendor.vendor_type === "BUSINESS"
                              ? "Business"
                              : "Individual"}
                          </span>

                          {vendor.business_name && (
                            <span>{vendor.business_name}</span>
                          )}

                          {vendor.public_email && (
                            <span>{vendor.public_email}</span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>/{vendor.slug}</span>

                          <span>•</span>

                          <span>
                            {vendor.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={busy}>
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {vendor.status !== "APPROVED" && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(vendor)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}

                          {vendor.status !== "REJECTED" && (
                            <DropdownMenuItem
                              onClick={() => handleReject(vendor)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}

                          {vendor.status === "APPROVED" && (
                            <DropdownMenuItem
                              onClick={() => handleSuspend(vendor)}
                            >
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}

                          {vendor.status === "SUSPENDED" && (
                            <DropdownMenuItem
                              onClick={() => handleReactivate(vendor)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor details dialog */}
      <Dialog
        open={!!selectedVendor}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVendor(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedVendor && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {selectedVendor.logo_url ? (
                      <img
                        src={selectedVendor.logo_url}
                        alt={selectedVendor.store_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <DialogTitle>{selectedVendor.store_name}</DialogTitle>

                    <DialogDescription>
                      Vendor profile and marketplace approval information.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedVendor.status} />

                  <Badge
                    variant="outline"
                    className={
                      selectedVendor.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-700"
                    }
                  >
                    {selectedVendor.is_active ? "Active" : "Inactive"}
                  </Badge>

                  <Badge variant="outline">
                    {selectedVendor.vendor_type === "BUSINESS"
                      ? "Business"
                      : "Individual"}
                  </Badge>
                </div>

                {/* Store information */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold">
                    Store information
                  </h3>

                  <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Store name
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedVendor.store_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Store slug
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        /{selectedVendor.slug}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Business name
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedVendor.business_name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Vendor type
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedVendor.vendor_type === "BUSINESS"
                          ? "Business"
                          : "Individual"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold">
                    Contact information
                  </h3>

                  <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Public email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium">
                        {selectedVendor.public_email || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedVendor.phone || "—"}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground">Address</p>

                      <p className="mt-1 text-sm font-medium">
                        {selectedVendor.address || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Description</h3>

                  <div className="rounded-xl border p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selectedVendor.description ||
                        "No store description provided."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
                  {selectedVendor.status !== "APPROVED" && (
                    <Button
                      onClick={() => handleApprove(selectedVendor)}
                      disabled={actionLoading === selectedVendor.id}
                    >
                      {actionLoading === selectedVendor.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  )}

                  {selectedVendor.status !== "REJECTED" && (
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedVendor)}
                      disabled={actionLoading === selectedVendor.id}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  )}

                  {selectedVendor.status === "APPROVED" && (
                    <Button
                      variant="outline"
                      onClick={() => handleSuspend(selectedVendor)}
                      disabled={actionLoading === selectedVendor.id}
                    >
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Suspend
                    </Button>
                  )}

                  {selectedVendor.status === "SUSPENDED" && (
                    <Button
                      onClick={() => handleReactivate(selectedVendor)}
                      disabled={actionLoading === selectedVendor.id}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
