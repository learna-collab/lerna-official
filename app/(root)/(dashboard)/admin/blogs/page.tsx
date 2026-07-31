export const dynamic = "force-dynamic";
export const revalidate = 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import DeleteBlogButton from "@/components/admin/delete-blog-button";
import { BlogService } from "@/app/services/blog.services";

export default async function BlogsPage() {
  let blogs: any[] = [];

  try {
    blogs = await BlogService.getBlogs();
  } catch {
    blogs = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Blogs
            </h1>
            <p className="text-gray-500 text-sm">
              Manage and publish your content
            </p>
          </div>

          <Link
            href="/admin/blogs/create"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-black/90 transition shadow-sm"
          >
            + Create Blog
          </Link>
        </div>

        {/* EMPTY STATE */}
        {blogs.length === 0 ? (
          <div className="border rounded-2xl p-14 text-center bg-white shadow-sm">
            <div className="text-5xl mb-3">📝</div>
            <h2 className="text-xl font-semibold">No blogs yet</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Start by creating your first article.
            </p>

            <Link
              href="/admin/blogs/create"
              className="inline-block mt-6 bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-black/90 transition"
            >
              Create your first blog
            </Link>
          </div>
        ) : (
          /* BLOG LIST */
          <div className="space-y-3">
            {blogs.map((blog: any) => {
              const createdAt = blog.createdAt || blog.created_at;

              return (
                <div
                  key={blog.id}
                  className="group flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-2xl p-5 bg-white hover:shadow-md transition"
                >
                  {/* LEFT */}
                  <Link
                    href={`/admin/blogs/${blog.id}`}
                    className="flex-1 space-y-2"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-semibold text-lg group-hover:text-black/70 transition">
                        {blog.title}
                      </h2>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          blog.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-1">
                      {blog.excerpt}
                    </p>

                    <p className="text-xs text-gray-400">
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </Link>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 md:ml-6">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      Edit
                    </Link>

                    <DeleteBlogButton id={blog.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
