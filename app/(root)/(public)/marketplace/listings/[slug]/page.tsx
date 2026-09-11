"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  Package,
  Store,
} from "lucide-react";

import { MarketplacePublicService } from "@/app/services/public.service";

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
    label: "Physical Product",
    icon: Package,
  },
  SERVICE: {
    label: "Service",
    icon: BriefcaseBusiness,
  },
  DIGITAL: {
    label: "Digital Product",
    icon: Download,
  },
};

export default function ListingDetailsPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [listing, setListing] = useState<Listing | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const loadListing = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const data = await MarketplacePublicService.getListing(slug);

        setListing(data);

        const primaryImage =
          data.images?.find((image: ListingImage) => image.is_primary) ??
          data.images?.[0];

        setSelectedImage(primaryImage?.image_url ?? null);
      } catch (error) {
        console.error("Failed to load listing:", error);

        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="animate-pulse">
            <div className="mb-8 h-5 w-40 rounded bg-muted" />

            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <div className="aspect-square rounded-2xl bg-muted" />

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg bg-muted"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="h-6 w-32 rounded bg-muted" />

                <div className="h-10 w-3/4 rounded bg-muted" />

                <div className="h-8 w-40 rounded bg-muted" />

                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>

                <div className="h-24 w-full rounded-xl bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />

          <h1 className="mt-6 text-3xl font-bold">Listing not found</h1>

          <p className="mt-3 max-w-md text-muted-foreground">
            The listing you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            href="/marketplace/listings"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  const meta = listingTypeMeta[listing.listing_type];

  const Icon = meta.icon;

  const images = listing.images ?? [];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/marketplace/listings"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Icon className="h-20 w-20 text-muted-foreground" />
                </div>
              )}

              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
                <Icon className="h-4 w-4" />

                {meta.label}
              </div>

              {listing.is_featured && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Featured
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.image_url)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition ${
                      selectedImage === image.image_url
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Icon className="h-4 w-4" />

              {meta.label}
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {listing.title}
            </h1>

            <div className="mt-6">
              <p className="text-3xl font-bold">
                {listing.currency} {Number(listing.price).toLocaleString()}
              </p>
            </div>

            {listing.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">About this listing</h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            )}

            {listing.vendor && (
              <div className="mt-8 rounded-xl border bg-muted/30 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Sold by
                    </p>

                    <Link
                      href={`/marketplace/stores/${listing.vendor.slug}`}
                      className="mt-1 block truncate text-lg font-semibold transition-colors hover:text-primary"
                    >
                      {listing.vendor.store_name}
                    </Link>

                    <Link
                      href={`/marketplace/stores/${listing.vendor.slug}`}
                      className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
                    >
                      View store
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-xl border p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <h3 className="font-semibold">
                    Verified marketplace listing
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    This listing is published by a vendor approved to sell on
                    the LERNA Marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
