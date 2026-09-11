"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  ChevronDown,
  Download,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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

type ListingType = "ALL" | "PHYSICAL" | "SERVICE" | "DIGITAL";

const listingTypeMeta = {
  PHYSICAL: {
    label: "Products",
    icon: Package,
  },
  SERVICE: {
    label: "Services",
    icon: BriefcaseBusiness,
  },
  DIGITAL: {
    label: "Digital",
    icon: Download,
  },
};

export default function MarketplaceListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedType, setSelectedType] = useState<ListingType>("ALL");

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [listingData, categoryData] = await Promise.all([
          MarketplacePublicService.getListings(),
          MarketplacePublicService.getCategories(),
        ]);

        setListings(listingData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to load marketplace listings:", err);

        setError("Unable to load marketplace listings.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadListings = async (type: ListingType, categoryId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await MarketplacePublicService.getListings({
        listing_type: type === "ALL" ? undefined : type,
        category_id: categoryId === "ALL" ? undefined : categoryId,
      });

      setListings(data);
    } catch (err) {
      console.error("Failed to filter marketplace listings:", err);

      setError("Unable to load the selected listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: ListingType) => {
    setSelectedType(type);

    loadListings(type, selectedCategory);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    loadListings(selectedType, categoryId);
  };

  const filteredListings = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return listings;
    }

    return listings.filter((listing) => {
      const title = listing.title?.toLowerCase() ?? "";

      const description = listing.description?.toLowerCase() ?? "";

      const storeName = listing.vendor?.store_name?.toLowerCase() ?? "";

      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        storeName.includes(searchTerm)
      );
    });
  }, [listings, search]);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">
              LERNA Marketplace
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Explore the marketplace
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              Discover products, services, and digital offerings from verified
              vendors.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, services, or stores..."
                className="h-12 w-full rounded-xl border bg-background pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />

            <span className="text-sm font-medium">Browse by type</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("ALL")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === "ALL"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-background hover:bg-muted"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("PHYSICAL")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === "PHYSICAL"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-background hover:bg-muted"
              }`}
            >
              <Package className="h-4 w-4" />
              Products
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("SERVICE")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === "SERVICE"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-background hover:bg-muted"
              }`}
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Services
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("DIGITAL")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedType === "DIGITAL"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-background hover:bg-muted"
              }`}
            >
              <Download className="h-4 w-4" />
              Digital
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Marketplace listings</h2>

            {!loading && (
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "listing" : "listings"}
              </p>
            )}
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="h-10 min-w-[220px] appearance-none rounded-lg border bg-background px-4 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-square animate-pulse bg-muted" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

                  <div className="h-4 w-full animate-pulse rounded bg-muted" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

                  <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-xl font-semibold">No listings found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try changing your category, listing type, or search term.
            </p>

            {(search ||
              selectedType !== "ALL" ||
              selectedCategory !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedType("ALL");
                  setSelectedCategory("ALL");

                  loadListings("ALL", "ALL");
                }}
                className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((listing) => {
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
