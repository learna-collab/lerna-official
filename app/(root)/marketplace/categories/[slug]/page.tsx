/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Download,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { MarketplacePublicService } from "@/app/services/public.service";
import { useCartStore } from "@/app/store/cart-store";

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

  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { cart, addItem, loadCart } = useCartStore();

  useEffect(() => {
    if (!slug) return;

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

        await loadCart();
      } catch (error) {
        console.error("Failed to load category:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    void loadCategory();
  }, [slug, loadCart]);

  const cartCount = cart?.total_items ?? 0;

  const getQuantity = (listingId: string) => quantities[listingId] ?? 1;

  const increaseQuantity = (event: React.MouseEvent, listingId: string) => {
    event.preventDefault();
    event.stopPropagation();

    setQuantities((current) => ({
      ...current,
      [listingId]: (current[listingId] ?? 1) + 1,
    }));
  };

  const decreaseQuantity = (event: React.MouseEvent, listingId: string) => {
    event.preventDefault();
    event.stopPropagation();

    setQuantities((current) => ({
      ...current,
      [listingId]: Math.max(1, (current[listingId] ?? 1) - 1),
    }));
  };

  const handleAddToCart = async (event: React.MouseEvent, listing: Listing) => {
    event.preventDefault();
    event.stopPropagation();

    if (addingToCart === listing.id) return;

    try {
      setAddingToCart(listing.id);

      await addItem(listing.id, getQuantity(listing.id));

      toast.success("Added to cart", {
        description: `${listing.title} has been added to your cart.`,
      });

      setQuantities((current) => ({
        ...current,
        [listing.id]: 1,
      }));
    } catch (err: any) {
      console.error(err);

      toast.error("Unable to add to cart", {
        description: err?.response?.data?.detail || "Please try again.",
      });
    } finally {
      setAddingToCart(null);
    }
  };

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
                    <div className="h-10 w-full rounded bg-muted" />
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link
                href="/marketplace"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to marketplace
              </Link>

              <h1 className="text-4xl font-bold tracking-tight">
                {category.name}
              </h1>

              {category.description && (
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>

            <Link
              href="/marketplace/cart"
              className="relative inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <ShoppingCart className="h-5 w-5" />

              <span className="hidden sm:inline">Cart</span>

              {cartCount > 0 && (
                <span className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-semibold">No listings yet</h2>

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

                const quantity = getQuantity(listing.id);
                const isAdding = addingToCart === listing.id;

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

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold">
                            {listing.currency}{" "}
                            {Number(listing.price).toLocaleString()}
                          </p>
                        </div>

                        {listing.vendor && (
                          <span className="max-w-[120px] truncate text-right text-xs text-muted-foreground">
                            {listing.vendor.store_name}
                          </span>
                        )}
                      </div>

                      <div
                        className="mt-4 space-y-2"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <div className="flex items-center justify-between rounded-lg border bg-background">
                          <button
                            type="button"
                            onClick={(event) =>
                              decreaseQuantity(event, listing.id)
                            }
                            disabled={quantity <= 1 || isAdding}
                            className="flex h-9 w-9 items-center justify-center rounded-l-lg transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="text-sm font-medium">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={(event) =>
                              increaseQuantity(event, listing.id)
                            }
                            disabled={isAdding}
                            className="flex h-9 w-9 items-center justify-center rounded-r-lg transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => handleAddToCart(event, listing)}
                          disabled={isAdding}
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <ShoppingCart className="h-4 w-4" />

                          {isAdding ? "Adding..." : "Add to Cart"}
                        </button>
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
