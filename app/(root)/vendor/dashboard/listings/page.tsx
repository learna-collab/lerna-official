/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Loader2,
  Package,
  Plus,
  Search,
  Store,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

import { useAuthStore } from "@/app/store/auth-store";
import { MarketplaceVendorService } from "@/app/services/vendor.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type ListingType = "PHYSICAL" | "SERVICE" | "DIGITAL";

type ListingStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  listing_type: ListingType;
  status: ListingStatus;
  is_featured: boolean;
  images?: {
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }[];
}

const statusConfig: Record<
  ListingStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  ACTIVE: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  INACTIVE: {
    label: "Inactive",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  ARCHIVED: {
    label: "Archived",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const typeConfig: Record<
  ListingType,
  {
    label: string;
    icon: typeof Package;
  }
> = {
  PHYSICAL: {
    label: "Physical product",
    icon: Package,
  },
  SERVICE: {
    label: "Service",
    icon: BriefcaseBusiness,
  },
  DIGITAL: {
    label: "Digital product",
    icon: Download,
  },
};

export default function VendorListingsPage() {
  const { user, hydrated, isLoading: authLoading } = useAuthStore();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ListingStatus>(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | ListingType>("ALL");

  const [actionId, setActionId] = useState<string | null>(null);

  async function loadListings() {
    try {
      setLoading(true);

      const response = await MarketplaceVendorService.getListings();

      setListings(response ?? []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Unable to load your listings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hydrated || authLoading) {
      return;
    }

    if (!user || user.role !== "VENDOR") {
      return;
    }

    Promise.resolve().then(() => loadListings());
  }, [hydrated, authLoading, user]);

  const filteredListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch =
        !normalizedSearch ||
        listing.title.toLowerCase().includes(normalizedSearch) ||
        listing.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || listing.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" || listing.listing_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [listings, search, statusFilter, typeFilter]);

  async function handleActivate(listingId: string) {
    try {
      setActionId(listingId);

      const updated = await MarketplaceVendorService.activateListing(listingId);

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId ? updated : listing,
        ),
      );

      toast.success("Listing activated successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Unable to activate this listing.",
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleDeactivate(listingId: string) {
    try {
      setActionId(listingId);

      const updated =
        await MarketplaceVendorService.deactivateListing(listingId);

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId ? updated : listing,
        ),
      );

      toast.success("Listing deactivated.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Unable to deactivate this listing.",
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleArchive(listingId: string) {
    try {
      setActionId(listingId);

      const updated = await MarketplaceVendorService.archiveListing(listingId);

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId ? updated : listing,
        ),
      );

      toast.success("Listing archived.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Unable to archive this listing.",
      );
    } finally {
      setActionId(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  }

  if (!hydrated || authLoading || loading) {
    return <ListingsSkeleton />;
  }

  if (!user || user.role !== "VENDOR") {
    return null;
  }

  const totalCount = listings.length;

  const activeCount = listings.filter(
    (listing) => listing.status === "ACTIVE",
  ).length;

  const draftCount = listings.filter(
    (listing) => listing.status === "DRAFT",
  ).length;

  const archivedCount = listings.filter(
    (listing) => listing.status === "ARCHIVED",
  ).length;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-3 mb-4">
            <Link href="/vendor/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Vendor dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Your listings
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Manage the products and services available in your marketplace
                store.
              </p>
            </div>

            <Button asChild>
              <Link href="/vendor/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                New listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total listings"
            value={totalCount}
            icon={Package}
          />

          <SummaryCard label="Active" value={activeCount} icon={CheckCircle2} />

          <SummaryCard label="Drafts" value={draftCount} icon={Clock3} />

          <SummaryCard label="Archived" value={archivedCount} icon={Archive} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your listings..."
                  className="pl-9"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | ListingStatus)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="ALL">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* Type */}
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as "ALL" | ListingType)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="ALL">All types</option>
                <option value="PHYSICAL">Physical</option>
                <option value="SERVICE">Services</option>
                <option value="DIGITAL">Digital</option>
              </select>

              {(search || statusFilter !== "ALL" || typeFilter !== "ALL") && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              {listings.length === 0 ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-8 w-8 text-primary" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    No listings yet
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Create your first listing to start building your marketplace
                    store.
                  </p>

                  <Button asChild className="mt-6">
                    <Link href="/vendor/dashboard/listings/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create listing
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-10 w-10 text-muted-foreground" />

                  <h2 className="mt-5 text-xl font-semibold">
                    No listings found
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Try changing your search or filters.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                actionLoading={actionId === listing.id}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onArchive={handleArchive}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ListingCard({
  listing,
  actionLoading,
  onActivate,
  onDeactivate,
  onArchive,
}: {
  listing: Listing;
  actionLoading: boolean;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const type = typeConfig[listing.listing_type];
  const TypeIcon = type.icon;

  const primaryImage =
    listing.images?.find((image) => image.is_primary)?.image_url ||
    listing.images?.[0]?.image_url;

  const status = statusConfig[listing.status];

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge variant="outline" className={status.className}>
            {listing.status}
          </Badge>
        </div>

        {listing.is_featured && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-background/95 text-foreground hover:bg-background">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Type */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TypeIcon className="h-3.5 w-3.5" />
          {type.label}
        </div>

        {/* Title */}
        <h2 className="mt-2 line-clamp-2 min-h-12 font-semibold">
          {listing.title}
        </h2>

        {/* Price */}
        <p className="mt-2 text-lg font-bold">
          {listing.currency} {Number(listing.price).toLocaleString()}
        </p>

        {/* Description */}
        {listing.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {listing.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/vendor/dashboard/listings/${listing.id}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Manage
            </Link>
          </Button>

          {listing.status === "DRAFT" && (
            <Button
              size="sm"
              disabled={actionLoading}
              onClick={() => onActivate(listing.id)}
            >
              {actionLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Activate
            </Button>
          )}

          {listing.status === "INACTIVE" && (
            <Button
              size="sm"
              disabled={actionLoading}
              onClick={() => onActivate(listing.id)}
            >
              {actionLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Activate
            </Button>
          )}

          {listing.status === "ACTIVE" && (
            <Button
              variant="outline"
              size="sm"
              disabled={actionLoading}
              onClick={() => onDeactivate(listing.id)}
            >
              {actionLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
              )}
              Deactivate
            </Button>
          )}

          {listing.status !== "ARCHIVED" && (
            <Button
              variant="ghost"
              size="sm"
              disabled={actionLoading}
              onClick={() => onArchive(listing.id)}
            >
              <Archive className="mr-1.5 h-3.5 w-3.5" />
              Archive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function ListingsSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded bg-muted" />

          <div className="mt-5 h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>

        <div className="mb-6 h-20 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[480px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
