/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  Pencil,
  Power,
  PowerOff,
  Save,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { MarketplaceVendorService } from "@/app/services/vendor.service";
import { MarketplacePublicService } from "@/app/services/public.service";
import { useAuthStore } from "@/app/store/auth-store";

type ListingType = "PHYSICAL" | "SERVICE" | "DIGITAL";

type ListingStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

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
  listing_type: ListingType;
  status: ListingStatus;
  is_featured: boolean;
  images?: ListingImage[];
  vendor?: {
    id: string;
    store_name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function VendorListingDetailPage() {
  const router = useRouter();
  const params = useParams();

  const listingId = String(params.id);

  const { user, hydrated, isLoading } = useAuthStore();

  const [listing, setListing] = useState<Listing | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [form, setForm] = useState({
    category_id: "",
    listing_type: "PHYSICAL" as ListingType,
    title: "",
    description: "",
    price: "",
    currency: "NGN",
    is_featured: false,
  });

  async function loadPage() {
    try {
      setLoading(true);

      const [listingData, categoriesData] = await Promise.all([
        MarketplaceVendorService.getListing(listingId),
        MarketplacePublicService.getCategories(),
      ]);

      setListing(listingData);
      setCategories(categoriesData);

      setForm({
        category_id: listingData.category?.id || "",
        listing_type: listingData.listing_type,
        title: listingData.title || "",
        description: listingData.description || "",
        price: String(listingData.price ?? ""),
        currency: listingData.currency || "NGN",
        is_featured: Boolean(listingData.is_featured),
      });
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 404) {
        toast.error("Listing not found.");
      } else {
        toast.error("Unable to load listing.");
      }

      setListing(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hydrated || isLoading) {
      return;
    }

    if (!user) {
      router.replace(`/login?next=/vendor/dashboard/listings/${listingId}`);
      return;
    }

    if (user.role !== "VENDOR") {
      router.replace("/dashboard");
      return;
    }

    Promise.resolve().then(() => loadPage());
  }, [hydrated, isLoading, user, router, listingId]);

  function updateForm(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a listing title.");
      return;
    }

    if (!form.category_id) {
      toast.error("Please select a category.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);

      const updated = await MarketplaceVendorService.updateListing(listingId, {
        category_id: form.category_id,
        listing_type: form.listing_type,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        currency: form.currency.trim() || "NGN",
        is_featured: form.is_featured,
      });

      setListing(updated);

      toast.success("Listing updated successfully.");
    } catch (error: any) {
      console.error(error);

      const detail = error?.response?.data?.detail;

      toast.error(
        typeof detail === "string" ? detail : "Unable to update listing.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function runAction(action: "activate" | "deactivate" | "archive") {
    try {
      setActionLoading(action);

      let updated: Listing;

      if (action === "activate") {
        updated = await MarketplaceVendorService.activateListing(listingId);
      } else if (action === "deactivate") {
        updated = await MarketplaceVendorService.deactivateListing(listingId);
      } else {
        updated = await MarketplaceVendorService.archiveListing(listingId);
      }

      setListing(updated);

      toast.success(
        action === "activate"
          ? "Listing activated."
          : action === "deactivate"
            ? "Listing deactivated."
            : "Listing archived.",
      );
    } catch (error: any) {
      console.error(error);

      const detail = error?.response?.data?.detail;

      toast.error(
        typeof detail === "string" ? detail : `Unable to ${action} listing.`,
      );
    } finally {
      setActionLoading(null);
    }
  }

  if (!hydrated || isLoading || !user || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-xl border bg-background p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Package className="h-5 w-5" />
          </div>

          <h1 className="text-lg font-semibold">Listing not found</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            The listing may have been removed or you may no longer have access
            to it.
          </p>

          <Link
            href="/vendor/dashboard/listings"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const isArchived = listing.status === "ARCHIVED";

  const isActive = listing.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/vendor/dashboard/listings"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background transition hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <p className="text-sm text-muted-foreground">
                Vendor Dashboard / Listings
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                {listing.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {listing.status === "DRAFT" && (
              <button
                type="button"
                onClick={() => runAction("activate")}
                disabled={actionLoading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {actionLoading === "activate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Publish
              </button>
            )}

            {isActive && (
              <button
                type="button"
                onClick={() => runAction("deactivate")}
                disabled={actionLoading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
              >
                {actionLoading === "deactivate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PowerOff className="h-4 w-4" />
                )}
                Deactivate
              </button>
            )}

            {!isActive && !isArchived && (
              <button
                type="button"
                onClick={() => runAction("activate")}
                disabled={actionLoading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {actionLoading === "activate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
                Activate
              </button>
            )}

            {!isArchived && (
              <button
                type="button"
                onClick={() => runAction("archive")}
                disabled={actionLoading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-destructive/30 bg-background px-4 text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-60"
              >
                {actionLoading === "archive" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                Archive
              </button>
            )}

            {isActive && listing.vendor?.slug && (
              <Link
                href={`/marketplace/listings/${listing.slug}`}
                target="_blank"
                className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />
                View listing
              </Link>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              listing.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : listing.status === "DRAFT"
                  ? "bg-yellow-100 text-yellow-700"
                  : listing.status === "INACTIVE"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {listing.status}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {listing.listing_type}
          </span>

          {listing.is_featured && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Featured
            </span>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main form */}
          <form
            onSubmit={handleSave}
            className="rounded-xl border bg-background p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Pencil className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Listing information</h2>

                <p className="text-sm text-muted-foreground">
                  Update the information customers see.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  disabled={isArchived}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={form.category_id}
                  onChange={(event) =>
                    updateForm("category_id", event.target.value)
                  }
                  disabled={isArchived}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Listing type
                </label>

                <select
                  value={form.listing_type}
                  onChange={(event) =>
                    updateForm(
                      "listing_type",
                      event.target.value as ListingType,
                    )
                  }
                  disabled={isArchived}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="PHYSICAL">Physical product</option>

                  <option value="SERVICE">Service</option>

                  <option value="DIGITAL">Digital product</option>
                </select>

                <p className="mt-2 text-xs text-muted-foreground">
                  Type-specific details are managed when the listing is created.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  disabled={isArchived}
                  rows={6}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateForm("price", event.target.value)
                    }
                    disabled={isArchived}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Currency
                  </label>

                  <input
                    type="text"
                    value={form.currency}
                    onChange={(event) =>
                      updateForm("currency", event.target.value.toUpperCase())
                    }
                    disabled={isArchived}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) =>
                    updateForm("is_featured", event.target.checked)
                  }
                  disabled={isArchived}
                  className="mt-1 h-4 w-4 rounded"
                />

                <span>
                  <span className="block text-sm font-medium">
                    Featured listing
                  </span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    Keep this listing marked as featured.
                  </span>
                </span>
              </label>

              <div className="flex justify-end border-t pt-5">
                <button
                  type="submit"
                  disabled={saving || isArchived}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save changes
                </button>
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Preview image */}
            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <div className="aspect-square bg-muted">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={
                      listing.images.find((image) => image.is_primary)
                        ?.image_url || listing.images[0].image_url
                    }
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10" />
                    <p className="mt-3 text-sm">No image</p>
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm text-muted-foreground">Current price</p>

                <p className="mt-1 text-2xl font-bold">
                  {listing.currency} {Number(listing.price).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Store */}
            {listing.vendor && (
              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Store className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Store</p>

                    <p className="font-semibold">{listing.vendor.store_name}</p>
                  </div>
                </div>

                <Link
                  href={`/marketplace/stores/${listing.vendor.slug}`}
                  target="_blank"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition hover:bg-muted"
                >
                  View store
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Listing details */}
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold">Listing details</h3>

              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Type</dt>

                  <dd className="font-medium">{listing.listing_type}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>

                  <dd className="font-medium">{listing.status}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Images</dt>

                  <dd className="font-medium">{listing.images?.length || 0}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Featured</dt>

                  <dd className="font-medium">
                    {listing.is_featured ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
