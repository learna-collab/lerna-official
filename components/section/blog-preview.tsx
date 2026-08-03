export const dynamic = "force-dynamic";
export const revalidate = 0;

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { BlogService } from "@/app/services/blog.services";

export default async function FeaturedPosts() {
  let posts: any[] = [];

  try {
    const data = await BlogService.getFeaturedBlogs();

    // Normalize response
    posts = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
  } catch (error) {
    console.error("Failed to load featured blogs:", error);

    // Do not crash the page in production
    return null;
  }

  if (!posts.length) return null;

  return (
    <section className="bg-[#f8fafc] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">
          Featured Articles
        </p>

        <h2 className="text-5xl font-bold tracking-tight text-gray-900">
          Insights For School Leaders
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blogs/${post.id}`}
              className="group overflow-hidden rounded-3xl border border-black/5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {post.cover_image ? (
                <div className="overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-400">
                  No image
                </div>
              )}

              <div className="p-6">
                <p className="mb-3 text-sm font-medium text-brand-blue">
                  {post.reading_time ?? 1} min read
                </p>

                <h3 className="line-clamp-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-brand-blue">
                  {post.title}
                </h3>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/60">
                  {post.excerpt}
                </p>

                <div className="mt-6 text-xs text-gray-400">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
