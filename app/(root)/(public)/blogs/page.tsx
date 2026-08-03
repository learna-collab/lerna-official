export const dynamic = "force-dynamic";
export const revalidate = 0;

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { BlogService } from "@/app/services/blog.services";

export default async function BlogPage() {
  let blogs: any[] = [];

  try {
    const data = await BlogService.getBlogs();

    // Support both [] and { data: [] }
    blogs = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
  } catch (error) {
    console.error("Failed to load blogs:", error);
    blogs = [];
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      {/* HEADER */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Blog</h1>

        <p className="mt-4 text-lg text-gray-600">
          Insights, updates, and stories from our team.
        </p>
      </div>

      {/* EMPTY STATE */}
      {blogs.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center rounded-3xl border bg-gray-50 p-12 text-center">
          <div className="text-5xl">📝</div>

          <h2 className="mt-4 text-xl font-semibold">No blog posts yet</h2>

          <p className="mt-2 text-gray-500">
            Check back soon for new content and updates.
          </p>
        </div>
      ) : (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: any) => (
            <Link
              href={`/blogs/${blog.id}`}
              key={blog.id}
              className="group overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                {blog.cover_image ? (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-brand-blue">
                  {blog.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                  {blog.excerpt}
                </p>

                {/* META */}
                <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
                  <span>{blog.reading_time ?? 1} min read</span>

                  <span>
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
