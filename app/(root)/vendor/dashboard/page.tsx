/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CircleAlert,
  Clock3,
  ExternalLink,
  Package,
  Plus,
  Settings,
  Store,
  UserRound,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MarketplaceVendorService } from "@/app/services/vendor.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/app/store/auth-store";

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

interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  listing_type: "PHYSICAL" | "SERVICE" | "DIGITAL";
  status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  is_featured: boolean;
  images?: {
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }[];
}

const statusConfig = {
  PENDING: {
    label: "Pending approval",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: BadgeCheck,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: CircleAlert,
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: CircleAlert,
  },
};

export default function VendorDashboardPage() {
  const router = useRouter();

  const { user, hydrated, isLoading: authLoading } = useAuthStore();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);
      setProfileNotFound(false);

      const [profileResponse, listingsResponse] = await Promise.all([
        MarketplaceVendorService.getProfile(),
        MarketplaceVendorService.getListings(),
      ]);

      setVendor(profileResponse);
      setListings(listingsResponse ?? []);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 404) {
        setProfileNotFound(true);
        setVendor(null);
        setListings([]);
      } else {
        toast.error(
          error?.response?.data?.detail ||
            "Unable to load your vendor dashboard.",
        );
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!hydrated || authLoading) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/vendor/dashboard");
      return;
    }

    if (user.role !== "VENDOR") {
      router.replace("/dashboard");
      return;
    }

    Promise.resolve().then(() => loadDashboard());
  }, [hydrated, authLoading, user, router]);

  if (!hydrated || authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (!user || user.role !== "VENDOR") {
    return null;
  }

  if (profileNotFound) {
    return (
      <main className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                Set up your store
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Your vendor account is ready. Complete your store profile before
                you start creating marketplace listings.
              </p>

              <Button asChild className="mt-6">
                <Link href="/vendor/dashboard/profile">
                  Complete store profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!vendor) {
    return null;
  }

  const status = statusConfig[vendor.status];
  const StatusIcon = status.icon;

  const activeListings = listings.filter(
    (listing) => listing.status === "ACTIVE",
  ).length;

  const draftListings = listings.filter(
    (listing) => listing.status === "DRAFT",
  ).length;

  const inactiveListings = listings.filter(
    (listing) => listing.status === "INACTIVE",
  ).length;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Vendor dashboard</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome, {user.first_name || "Vendor"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your store, listings, and marketplace presence.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/vendor/dashboard/profile">
                <Settings className="mr-2 h-4 w-4" />
                Store profile
              </Link>
            </Button>

            <Button asChild>
              <Link href="/vendor/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                New listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Approval status */}
        {vendor.status !== "APPROVED" && (
          <Card className="mb-6 overflow-hidden">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <StatusIcon className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{status.label}</h2>

                    <Badge variant="outline" className={status.className}>
                      {vendor.status}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {vendor.status === "PENDING" &&
                      "Your store is awaiting approval. You can prepare your listings while your account is being reviewed, but they cannot be published until your vendor account is approved."}

                    {vendor.status === "REJECTED" &&
                      "Your vendor application was rejected. Review your store profile and contact the marketplace administrator for further guidance."}

                    {vendor.status === "SUSPENDED" &&
                      "Your vendor account is currently suspended. Your listings cannot be actively published while the account is suspended."}
                  </p>
                </div>
              </div>

              <Button variant="outline" asChild>
                <Link href="/vendor/dashboard/profile">
                  Review profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Store summary */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.store_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-9 w-9 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold">
                    {vendor.store_name}
                  </h2>

                  <Badge variant="outline" className={status.className}>
                    <StatusIcon className="mr-1 h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {vendor.vendor_type === "BUSINESS"
                    ? vendor.business_name || "Business vendor"
                    : "Individual vendor"}
                </p>

                {vendor.description && (
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
                    {vendor.description}
                  </p>
                )}
              </div>

              {vendor.status === "APPROVED" && vendor.is_active && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/marketplace/stores/${vendor.slug}`}
                    target="_blank"
                  >
                    View store
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total listings"
            value={listings.length}
            icon={Package}
            description="All your marketplace listings"
          />

          <StatCard
            title="Active"
            value={activeListings}
            icon={BadgeCheck}
            description="Currently published listings"
          />

          <StatCard
            title="Drafts"
            value={draftListings}
            icon={Clock3}
            description="Listings still being prepared"
          />

          <StatCard
            title="Inactive"
            value={inactiveListings}
            icon={BarChart3}
            description="Listings not currently active"
          />
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Listings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your listings</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage the products and services in your store.
                </p>
              </div>

              <Button variant="ghost" asChild>
                <Link href="/vendor/dashboard/listings">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent>
              {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
                  <Package className="h-10 w-10 text-muted-foreground" />

                  <h3 className="mt-4 font-semibold">No listings yet</h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Create your first marketplace listing to start building your
                    store.
                  </p>

                  <Button asChild className="mt-5">
                    <Link href="/vendor/dashboard/listings/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create listing
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {listings.slice(0, 5).map((listing) => {
                    const primaryImage =
                      listing.images?.find((image) => image.is_primary)
                        ?.image_url || listing.images?.[0]?.image_url;

                    return (
                      <Link
                        key={listing.id}
                        href={`/vendor/dashboard/listings/${listing.id}`}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-medium">
                              {listing.title}
                            </h3>

                            {listing.status && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {listing.status}
                              </Badge>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {listing.listing_type}
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {listing.currency}{" "}
                            {Number(listing.price).toLocaleString()}
                          </p>
                        </div>

                        <ArrowRight className="mt-5 h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <QuickAction
                href="/vendor/dashboard/listings/new"
                icon={Plus}
                title="Create listing"
                description="Add a product or service"
              />

              <QuickAction
                href="/vendor/dashboard/listings"
                icon={Package}
                title="Manage listings"
                description="View and manage your listings"
              />

              <QuickAction
                href="/vendor/dashboard/profile"
                icon={Store}
                title="Store profile"
                description="Update your store information"
              />

              <QuickAction
                href="/vendor/dashboard/settings"
                icon={UserRound}
                title="Account settings"
                description="Manage your vendor account"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>

        <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/60"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>

      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-8 w-72" />
            <Skeleton className="mt-2 h-4 w-96 max-w-full" />
          </div>

          <Skeleton className="h-10 w-36" />
        </div>

        <Skeleton className="mb-6 h-28 w-full rounded-xl" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[420px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[420px] rounded-xl" />
        </div>
      </div>
    </main>
  );
}
