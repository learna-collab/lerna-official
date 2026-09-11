"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  GraduationCap,
  Package,
  Search,
  Store,
} from "lucide-react";

import { MarketplacePublicService } from "@/app/services/public.service";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency?: string | null;
  listing_type: "PHYSICAL" | "SERVICE" | "DIGITAL";
  status?: string;
  is_featured?: boolean;
  category_id?: string;
  vendor_id?: string;
  vendor?: {
    id: string;
    store_name: string;
    slug: string;
  } | null;
  images?: Array<{
    id?: string;
    image_url: string;
    is_primary?: boolean;
    sort_order?: number;
  }>;
}

const listingTypeMeta = {
  PHYSICAL: {
    label: "Product",
    icon: Package,
  },
  SERVICE: {
    label: "Service",
    icon: BriefcaseBusiness,
  },
  DIGITAL: {
    label: "Digital",
    icon: Download,
  },
} as const;

function formatPrice(price: number, currency?: string | null): string {
  const value = Number(price);

  if (Number.isNaN(value)) {
    return "Price unavailable";
  }

  const normalizedCurrency = currency || "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${normalizedCurrency} ${value.toLocaleString("en-NG")}`;
  }
}

function getListingImage(listing: Listing): string | null {
  if (!listing.images?.length) {
    return null;
  }

  const primaryImage = listing.images.find((image) => image.is_primary);

  return primaryImage?.image_url || listing.images[0]?.image_url || null;
}

export default function MarketplacePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMarketplace() {
      try {
        setLoading(true);

        const [categoriesData, listingsData] = await Promise.all([
          MarketplacePublicService.getCategories(),
          MarketplacePublicService.getListings(),
        ]);

        if (!mounted) {
          return;
        }

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        setListings(Array.isArray(listingsData) ? listingsData : []);
      } catch (error) {
        console.error("Failed to load marketplace:", error);

        if (!mounted) {
          return;
        }

        setCategories([]);
        setListings([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMarketplace();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredListings = useMemo(
    () => listings.filter((listing) => listing.is_featured),
    [listings],
  );

  const displayListings =
    featuredListings.length > 0
      ? featuredListings.slice(0, 8)
      : listings.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">
                  LERNA Market
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Education Marketplace
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find what your school needs.
              <span className="block text-muted-foreground">
                All in one marketplace.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover educational products, professional services, learning
              resources, and digital solutions from trusted vendors on the LERNA
              Marketplace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/marketplace/listings"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/vendor"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Store className="h-4 w-4" />
                Become a vendor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Search */}
      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <Link
          href="/marketplace/listings"
          className="group flex items-center justify-between rounded-xl border bg-muted/30 px-5 py-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Explore marketplace listings
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Browse products, services and digital resources
              </p>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Explore</p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Categories
            </h2>
          </div>

          <Link
            href="/marketplace/listings"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed px-6 py-12 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              No categories are available yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/marketplace/categories/${category.slug}`}
                className="group flex min-h-24 items-center justify-between rounded-xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <ArrowRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/marketplace/listings"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground sm:hidden"
        >
          View all listings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Listings */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Marketplace</p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {featuredListings.length > 0
                  ? "Featured listings"
                  : "Latest listings"}
              </h2>
            </div>

            <Link
              href="/marketplace/listings"
              className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-xl border bg-background"
                >
                  <div className="aspect-[4/3] animate-pulse bg-muted" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayListings.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed bg-background px-6 py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No listings available yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Listings from approved vendors will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayListings.map((listing) => {
                const meta = listingTypeMeta[listing.listing_type];

                const TypeIcon = meta.icon;
                const imageUrl = getListingImage(listing);

                return (
                  <Link
                    key={listing.id}
                    href={`/marketplace/listings/${listing.slug}`}
                    className="group overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}

                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur">
                        <TypeIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                        {listing.title}
                      </h3>

                      {listing.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {listing.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">
                          {formatPrice(listing.price, listing.currency)}
                        </span>

                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>

                      {listing.vendor?.store_name && (
                        <div className="mt-4 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                          <Store className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate">
                            {listing.vendor.store_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <Link
            href="/marketplace/listings"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground sm:hidden"
          >
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-8 rounded-2xl border bg-muted/30 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Sell on LERNA Marketplace
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Create your vendor account, set up your store and showcase your
              products or services to customers on LERNA.
            </p>
          </div>

          <Link
            href="/vendor"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Become a vendor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
