"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen, Loader2, Search } from "lucide-react";
import { MarketplacePublicService } from "@/app/services/public.service";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
}

export default function MarketplaceCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await MarketplacePublicService.getCategories();

        const activeCategories = data.filter(
          (category: Category) => category.is_active !== false,
        );

        setCategories(activeCategories);
      } catch (err) {
        console.error("Failed to load marketplace categories:", err);
        setError("Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query),
    );
  }, [search, categories]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Link
              href="/marketplace"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to marketplace
            </Link>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Categories
            </h1>

            <p className="mt-3 text-muted-foreground">
              Explore products and services from across the Lerna marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        {!loading && categories.length > 0 && (
          <div className="mb-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading categories...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="rounded-lg border bg-card px-6 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FolderOpen className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">No categories available</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                There are currently no marketplace categories available.
              </p>
            </div>
          </div>
        )}

        {/* No search results */}
        {!loading &&
          !error &&
          categories.length > 0 &&
          filteredCategories.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">No categories found</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Try searching with a different category name.
              </p>
            </div>
          )}

        {/* Categories */}
        {!loading && !error && filteredCategories.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">All categories</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredCategories.length}{" "}
                  {filteredCategories.length === 1 ? "category" : "categories"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/marketplace/categories/${category.slug}`}
                  className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                    <FolderOpen className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>

                  <h3 className="line-clamp-2 font-semibold">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    Browse
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
