"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Download,
  Package,
  Store,
} from "lucide-react";

import { MarketplacePublicService } from "@/app/services/public.service";

interface Vendor {
  id: string;
  store_name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  vendor_type?: "INDIVIDUAL" | "BUSINESS";
}

interface ListingImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  listing_type: "PHYSICAL" | "SERVICE" | "DIGITAL";
  is_featured: boolean;
  images?: ListingImage[];
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
};

export default function StorePage() {
  const params = useParams();

  const slug = params.slug as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);

  const [listings, setListings] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const loadStore = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const [vendorData, listingData] = await Promise.all([
          MarketplacePublicService.getStore(slug),
          MarketplacePublicService.getStoreListings(slug),
        ]);

        setVendor(vendorData);
        setListings(listingData);
      } catch (error) {
        console.error("Failed to load marketplace store:", error);

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="animate-pulse">
            <div className="h-5 w-40 rounded bg-muted" />

            <div className="mt-8 rounded-2xl border bg-muted/30 p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-24 w-24 rounded-2xl bg-muted" />

                <div className="flex-1 space-y-3">
                  <div className="h-8 w-64 rounded bg-muted" />
                  <div className="h-4 w-96 max-w-full rounded bg-muted" />
                  <div className="h-4 w-72 max-w-full rounded bg-muted" />
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border">
                  <div className="aspect-square bg-muted" />

                  <div className="space-y-3 p-4">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-5 w-1/3 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !vendor) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <Store className="h-12 w-12 text-muted-foreground" />

          <h1 className="mt-6 text-3xl font-bold">Store not found</h1>

          <p className="mt-3 max-w-md text-muted-foreground">
            This store does not exist or is no longer available on the LERNA
            Marketplace.
          </p>

          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          <div className="mt-8 rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.store_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {vendor.store_name}
                  </h1>

                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Verified Vendor
                  </span>
                </div>

                {vendor.description && (
                  <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                    {vendor.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Store className="h-4 w-4" />

                    {vendor.vendor_type === "BUSINESS"
                      ? "Business"
                      : "Individual Vendor"}
                  </span>

                  <span>
                    {listings.length}{" "}
                    {listings.length === 1 ? "listing" : "listings"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Store listings</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore products and services from {vendor.store_name}.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <Store className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-xl font-semibold">No active listings</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              This vendor has not published any listings yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => {
              const meta = listingTypeMeta[listing.listing_type];

              const Icon = meta.icon;

              const primaryImage =
                listing.images?.find((image) => image.is_primary) ??
                listing.images?.[0];

              return (
                <Link
                  key={listing.id}
                  href={`/marketplace/listings/${listing.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {primaryImage ? (
                      <img
                        src={primaryImage.image_url}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                      <Icon className="h-3.5 w-3.5" />

                      {meta.label}
                    </div>

                    {listing.is_featured && (
                      <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-primary">
                      {listing.title}
                    </h3>

                    {listing.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
                        {listing.description}
                      </p>
                    )}

                    <div className="mt-4">
                      <p className="text-lg font-bold">
                        {listing.currency}{" "}
                        {Number(listing.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
