"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { MarketplacePublicService } from "@/app/services/public.service";
import { useCartStore } from "@/app/store/cart-store";

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

function formatPrice(price: number, currency: string) {
  return `${currency} ${Number(price).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ListingDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [listing, setListing] = useState<Listing | null>(null);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem } = useCartStore();

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

    void loadListing();
  }, [slug]);

  const images = useMemo(() => listing?.images ?? [], [listing]);

  const selectedImageIndex = useMemo(() => {
    if (!selectedImage) {
      return -1;
    }

    return images.findIndex((image) => image.image_url === selectedImage);
  }, [images, selectedImage]);

  const showPreviousImage = () => {
    if (images.length <= 1) {
      return;
    }

    const currentIndex = selectedImageIndex >= 0 ? selectedImageIndex : 0;

    const previousIndex =
      currentIndex === 0 ? images.length - 1 : currentIndex - 1;

    setSelectedImage(images[previousIndex].image_url);
  };

  const showNextImage = () => {
    if (images.length <= 1) {
      return;
    }

    const currentIndex = selectedImageIndex >= 0 ? selectedImageIndex : 0;

    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    setSelectedImage(images[nextIndex].image_url);
  };

  const handleAddToCart = async () => {
    if (!listing) {
      return;
    }

    try {
      setAddingToCart(true);

      await addItem(listing.id, 1);

      toast.success("Added to cart", {
        description: `${listing.title} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add listing to cart:", error);

      toast.error("Unable to add to cart", {
        description: "Please try again.",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-8 h-5 w-40 rounded bg-muted" />

            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="aspect-square rounded-2xl bg-muted" />

                <div className="mt-4 grid grid-cols-5 gap-3">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl bg-muted"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-5 w-36 rounded bg-muted" />

                <div className="h-12 w-4/5 rounded bg-muted" />

                <div className="h-10 w-44 rounded bg-muted" />

                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>

                <div className="h-40 rounded-2xl bg-muted" />

                <div className="h-12 rounded-xl bg-muted" />
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
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Listing not found
          </h1>

          <p className="mt-3 max-w-md leading-6 text-muted-foreground">
            The listing you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            href="/marketplace/listings"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/marketplace"
            className="transition-colors hover:text-foreground"
          >
            Marketplace
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/marketplace/listings"
            className="transition-colors hover:text-foreground"
          >
            Listings
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="max-w-[220px] truncate text-foreground">
            {listing.title}
          </span>
        </div>

        {/* Main product area */}
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          {/* =========================
              IMAGE GALLERY
          ========================== */}
          <section>
            <div className="relative overflow-hidden rounded-3xl border bg-muted/30">
              <div className="aspect-square">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Icon className="h-24 w-24 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Listing type */}
              <div className="absolute left-5 top-5">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/95 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur">
                  <Icon className="h-4 w-4" />
                  {meta.label}
                </div>
              </div>

              {/* Featured */}
              {listing.is_featured && (
                <div className="absolute right-5 top-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Featured
                  </div>
                </div>
              )}

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm transition hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-background/90 shadow-sm transition hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.slice(0, 5).map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.image_url)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition ${
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
          </section>

          {/* =========================
              PRODUCT INFORMATION
          ========================== */}
          <section className="flex flex-col">
            {/* Type */}
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Icon className="h-4 w-4" />
              {meta.label}
            </div>

            {/* Title */}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {listing.title}
            </h1>

            {/* Price */}
            <div className="mt-6 border-b pb-6">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {formatPrice(listing.price, listing.currency)}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Secure checkout through the LERNA Marketplace.
              </p>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="py-7">
                <h2 className="text-lg font-semibold">About this listing</h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Purchase card */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold">Ready to purchase?</h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add this listing to your cart and continue to checkout when
                    you&apos;re ready.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </>
                  )}
                </button>

                <Link
                  href="/marketplace/cart"
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-6 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  View cart
                </Link>
              </div>
            </div>

            {/* Trust points */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">Secure marketplace</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Payments are processed securely through the marketplace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">Approved vendor</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      This listing is from an approved marketplace vendor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor */}
            {listing.vendor && (
              <div className="mt-5 rounded-2xl border bg-muted/20 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sold by
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-background">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/marketplace/stores/${listing.vendor.slug}`}
                      className="block truncate font-semibold transition-colors hover:text-primary"
                    >
                      {listing.vendor.store_name}
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Marketplace vendor
                    </p>
                  </div>

                  <Link
                    href={`/marketplace/stores/${listing.vendor.slug}`}
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    View store
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Bottom information */}
        <section className="mt-16 border-t pt-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mt-4 font-semibold">Secure payments</h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your payment is handled securely through the LERNA Marketplace
                checkout.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mt-4 font-semibold">Trusted vendors</h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Marketplace listings are published by approved vendors.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mt-4 font-semibold">Marketplace protection</h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Orders move through the marketplace fulfillment process before
                vendor funds are released.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
