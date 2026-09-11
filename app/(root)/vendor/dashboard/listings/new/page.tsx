/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  Download,
  Loader2,
  Package,
  Plus,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { MarketplacePublicService } from "@/app/services/public.service";
import { MarketplaceVendorService } from "@/app/services/vendor.service";
import { useAuthStore } from "@/app/store/auth-store";

type ListingType = "PHYSICAL" | "SERVICE" | "DIGITAL";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface ListingForm {
  category_id: string;
  listing_type: ListingType;
  title: string;
  description: string;
  price: string;
  currency: string;
  is_featured: boolean;
}

interface PhysicalForm {
  sku: string;
  stock_quantity: string;
  weight_kg: string;
  dimensions: string;
}

interface ServiceForm {
  pricing_model: string;
  duration_minutes: string;
  service_area: string;
  availability: string;
}

interface DigitalForm {
  file_url: string;
  file_type: string;
  access_type: string;
  instructions: string;
}

interface ImageForm {
  image_url: string;
  is_primary: boolean;
  sort_order: string;
}

const listingTypes: {
  value: ListingType;
  label: string;
  description: string;
  icon: typeof Package;
}[] = [
  {
    value: "PHYSICAL",
    label: "Physical product",
    description: "A tangible product with stock and inventory.",
    icon: Package,
  },
  {
    value: "SERVICE",
    label: "Service",
    description: "A service customers can purchase from your store.",
    icon: BriefcaseBusiness,
  },
  {
    value: "DIGITAL",
    label: "Digital product",
    description: "A downloadable or digitally delivered product.",
    icon: Download,
  },
];

export default function NewVendorListingPage() {
  const router = useRouter();

  const { user, hydrated, isLoading } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ListingForm>({
    category_id: "",
    listing_type: "PHYSICAL",
    title: "",
    description: "",
    price: "",
    currency: "NGN",
    is_featured: false,
  });

  const [physical, setPhysical] = useState<PhysicalForm>({
    sku: "",
    stock_quantity: "0",
    weight_kg: "",
    dimensions: "",
  });

  const [service, setService] = useState<ServiceForm>({
    pricing_model: "FIXED",
    duration_minutes: "",
    service_area: "",
    availability: "",
  });

  const [digital, setDigital] = useState<DigitalForm>({
    file_url: "",
    file_type: "",
    access_type: "DOWNLOAD",
    instructions: "",
  });

  const [image, setImage] = useState<ImageForm>({
    image_url: "",
    is_primary: true,
    sort_order: "0",
  });

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      const data = await MarketplacePublicService.getCategories();

      setCategories(data);

      if (data.length > 0) {
        setForm((current) => ({
          ...current,
          category_id: current.category_id || data[0].id,
        }));
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to load marketplace categories.");
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    if (!hydrated || isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/vendor/dashboard/listings/new");
      return;
    }

    if (user.role !== "VENDOR") {
      router.replace("/dashboard");
      return;
    }

    Promise.resolve().then(() => loadCategories());
  }, [hydrated, isLoading, user, router]);

  function updateForm(field: keyof ListingForm, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.category_id) {
      toast.error("Please select a category.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Please enter a listing title.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Step 1:
       * Create the base listing.
       */
      const listing = await MarketplaceVendorService.createListing({
        category_id: form.category_id,
        listing_type: form.listing_type,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        currency: form.currency.trim() || "NGN",
        is_featured: form.is_featured,
      });

      /*
       * Step 2:
       * Add the listing-type-specific information.
       */
      if (form.listing_type === "PHYSICAL") {
        await MarketplaceVendorService.addPhysicalProduct(listing.id, {
          sku: physical.sku.trim() || undefined,
          stock_quantity: Number(physical.stock_quantity) || 0,
          weight_kg: physical.weight_kg.trim()
            ? Number(physical.weight_kg)
            : undefined,
          dimensions: physical.dimensions.trim() || undefined,
        });
      }

      if (form.listing_type === "SERVICE") {
        await MarketplaceVendorService.addService(listing.id, {
          pricing_model: service.pricing_model.trim() || undefined,
          duration_minutes: service.duration_minutes.trim()
            ? Number(service.duration_minutes)
            : undefined,
          service_area: service.service_area.trim() || undefined,
          availability: service.availability.trim() || undefined,
        });
      }

      if (form.listing_type === "DIGITAL") {
        if (!digital.file_url.trim()) {
          toast.error("Please provide the digital product file URL.");
          return;
        }

        await MarketplaceVendorService.addDigitalProduct(listing.id, {
          file_url: digital.file_url.trim(),
          file_type: digital.file_type.trim() || undefined,
          access_type: digital.access_type.trim() || undefined,
          instructions: digital.instructions.trim() || undefined,
        });
      }

      /*
       * Step 3:
       * Add the image only when one was supplied.
       */
      if (image.image_url.trim()) {
        await MarketplaceVendorService.addListingImage(listing.id, {
          image_url: image.image_url.trim(),
          is_primary: image.is_primary,
          sort_order: Number(image.sort_order) || 0,
        });
      }

      toast.success("Listing created successfully.");

      router.push(`/vendor/dashboard/listings/${listing.id}`);
    } catch (error: any) {
      console.error(error);

      const detail = error?.response?.data?.detail;

      toast.error(
        typeof detail === "string" ? detail : "Unable to create listing.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated || isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/vendor/dashboard/listings"
            className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Vendor Dashboard
            </p>

            <h1 className="text-2xl font-bold tracking-tight">
              Create listing
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a product or service to your marketplace store.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing type */}
          <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold">What are you selling?</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose the listing type that best describes your offering.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {listingTypes.map((type) => {
                const Icon = type.icon;
                const selected = form.listing_type === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateForm("listing_type", type.value)}
                    className={`relative rounded-xl border p-5 text-left transition ${
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    )}

                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-semibold">{type.label}</h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Basic information */}
          <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-semibold">Basic information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Give customers the essential information about your listing.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Listing title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. Premium School Uniform"
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
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
                  disabled={loadingCategories}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="Describe your product or service..."
                  rows={5}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    placeholder="0.00"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
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
                    placeholder="NGN"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm uppercase outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-muted/40">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) =>
                    updateForm("is_featured", event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded"
                />

                <span>
                  <span className="block text-sm font-medium">
                    Request featured status
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    Mark this listing as featured when supported by your
                    marketplace account.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Physical details */}
          {form.listing_type === "PHYSICAL" && (
            <section className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">
                    Physical product details
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the inventory information for this product.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">SKU</label>

                  <input
                    type="text"
                    value={physical.sku}
                    onChange={(event) =>
                      setPhysical((current) => ({
                        ...current,
                        sku: event.target.value,
                      }))
                    }
                    placeholder="Optional SKU"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Stock quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={physical.stock_quantity}
                    onChange={(event) =>
                      setPhysical((current) => ({
                        ...current,
                        stock_quantity: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={physical.weight_kg}
                    onChange={(event) =>
                      setPhysical((current) => ({
                        ...current,
                        weight_kg: event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Dimensions
                  </label>

                  <input
                    type="text"
                    value={physical.dimensions}
                    onChange={(event) =>
                      setPhysical((current) => ({
                        ...current,
                        dimensions: event.target.value,
                      }))
                    }
                    placeholder="e.g. 30 × 20 × 10 cm"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Service details */}
          {form.listing_type === "SERVICE" && (
            <section className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">Service details</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell customers how your service is delivered.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Pricing model
                  </label>

                  <input
                    type="text"
                    value={service.pricing_model}
                    onChange={(event) =>
                      setService((current) => ({
                        ...current,
                        pricing_model: event.target.value,
                      }))
                    }
                    placeholder="e.g. FIXED"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={service.duration_minutes}
                    onChange={(event) =>
                      setService((current) => ({
                        ...current,
                        duration_minutes: event.target.value,
                      }))
                    }
                    placeholder="Optional"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Service area
                  </label>

                  <input
                    type="text"
                    value={service.service_area}
                    onChange={(event) =>
                      setService((current) => ({
                        ...current,
                        service_area: event.target.value,
                      }))
                    }
                    placeholder="e.g. Aba and surrounding areas"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Availability
                  </label>

                  <input
                    type="text"
                    value={service.availability}
                    onChange={(event) =>
                      setService((current) => ({
                        ...current,
                        availability: event.target.value,
                      }))
                    }
                    placeholder="e.g. Mon - Sat, 9am - 5pm"
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Digital details */}
          {form.listing_type === "DIGITAL" && (
            <section className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Download className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">
                    Digital product details
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Provide the information needed to deliver your digital
                    product.
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    File URL
                  </label>

                  <input
                    type="url"
                    value={digital.file_url}
                    onChange={(event) =>
                      setDigital((current) => ({
                        ...current,
                        file_url: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      File type
                    </label>

                    <input
                      type="text"
                      value={digital.file_type}
                      onChange={(event) =>
                        setDigital((current) => ({
                          ...current,
                          file_type: event.target.value,
                        }))
                      }
                      placeholder="e.g. PDF"
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Access type
                    </label>

                    <input
                      type="text"
                      value={digital.access_type}
                      onChange={(event) =>
                        setDigital((current) => ({
                          ...current,
                          access_type: event.target.value,
                        }))
                      }
                      placeholder="e.g. DOWNLOAD"
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Instructions
                  </label>

                  <textarea
                    value={digital.instructions}
                    onChange={(event) =>
                      setDigital((current) => ({
                        ...current,
                        instructions: event.target.value,
                      }))
                    }
                    placeholder="Explain how the customer should access or use the product."
                    rows={4}
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Image */}
          <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-semibold">Listing image</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add the image URL that should represent this listing.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Image URL
                </label>

                <input
                  type="url"
                  value={image.image_url}
                  onChange={(event) =>
                    setImage((current) => ({
                      ...current,
                      image_url: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sort order
                </label>

                <input
                  type="number"
                  min="0"
                  value={image.sort_order}
                  onChange={(event) =>
                    setImage((current) => ({
                      ...current,
                      sort_order: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3">
                <input
                  type="checkbox"
                  checked={image.is_primary}
                  onChange={(event) =>
                    setImage((current) => ({
                      ...current,
                      is_primary: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />

                <span className="text-sm font-medium">
                  Make this the primary image
                </span>
              </label>
            </div>
          </section>

          {/* Publishing notice */}
          <section className="rounded-xl border bg-muted/40 p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
                <Store className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold">Publishing</h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  New listings are created as drafts. Your vendor account must
                  be approved and active before a listing can be published.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/vendor/dashboard/listings"
              className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-5 text-sm font-medium transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                submitting || loadingCategories || categories.length === 0
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating listing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
