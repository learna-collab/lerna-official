export const dynamic = "force-dynamic";
export const revalidate = 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { BlogService } from "@/app/services/blog.services";

export default async function BlogPage() {
  const blogs = await BlogService.getBlogs();

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Insights, updates, and stories from our team.
        </p>
      </div>

      {/* EMPTY STATE */}
      {blogs.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center text-center border rounded-2xl p-12 bg-gray-50">
          <div className="text-5xl">📝</div>
          <h2 className="mt-4 text-xl font-semibold">No blog posts yet</h2>
          <p className="text-gray-500 mt-2">
            Check back soon for new content and updates.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: any) => (
            <Link
              href={`/blogs/${blog.id}`}
              key={blog.id}
              className="group border rounded-3xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                {blog.cover_image ? (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-56 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {blog.title}
                </h2>

                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* META */}
                <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
                  <span>{blog.reading_time} min read</span>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
