"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowLeft, BriefcaseBusiness, Download, Package } from "lucide-react";

import { MarketplacePublicService } from "@/app/services/public.service";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface ListingImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ListingVendor {
  id: string;
  store_name: string;
  slug: string;
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
  vendor?: ListingVendor;
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

export default function CategoryPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const [categoryData, listingData] = await Promise.all([
          MarketplacePublicService.getCategory(slug),
          MarketplacePublicService.getCategoryListings(slug),
        ]);

        setCategory(categoryData);
        setListings(listingData);
      } catch (error) {
        console.error("Failed to load category:", error);

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-muted" />

            <div className="h-4 w-96 rounded bg-muted" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border">
                  <div className="aspect-square bg-muted" />

                  <div className="space-y-3 p-4">
                    <div className="h-5 w-3/4 rounded bg-muted" />

                    <div className="h-4 w-1/2 rounded bg-muted" />

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

  if (notFound || !category) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold">Category not found</h1>

          <p className="mt-3 max-w-md text-muted-foreground">
            The category you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
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
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/marketplace"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>

          {category.description && (
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold">No listings yet</h2>

            <p className="mt-2 text-muted-foreground">
              There are currently no active listings in this category.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                {listings.length}{" "}
                {listings.length === 1 ? "listing" : "listings"}
              </h2>
            </div>

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
                    className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
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

                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                        <Icon className="h-3.5 w-3.5" />

                        {meta.label}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-2 font-semibold">
                        {listing.title}
                      </h3>

                      {listing.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {listing.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-bold">
                          {listing.currency}{" "}
                          {Number(listing.price).toLocaleString()}
                        </p>

                        {listing.vendor && (
                          <span className="truncate text-xs text-muted-foreground">
                            {listing.vendor.store_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
