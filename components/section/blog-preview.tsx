/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { BlogService } from "@/app/services/blog.services";

// Prevent static generation from failing during build
export const dynamic = "force-dynamic";

export default async function FeaturedPosts() {
  let posts: any[] = [];

  try {
    posts = await BlogService.getFeaturedBlogs();
  } catch (error) {
    console.error("Failed to load featured blogs:", error);

    // Return nothing instead of crashing the build
    return null;
  }

  if (!posts?.length) return null;

  return (
    <section className="bg-[#f8fafc] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">
          Featured Articles
        </p>

        <h2 className="text-5xl font-bold">Insights For School Leaders</h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blogs/${post.id}`}
              className="overflow-hidden rounded-3xl border border-black/5 bg-white transition hover:shadow-xl"
            >
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-64 w-full object-cover"
                />
              )}

              <div className="p-6">
                <p className="mb-3 text-sm text-brand-blue">
                  {post.reading_time} min read
                </p>

                <h3 className="text-2xl font-bold">{post.title}</h3>

                <p className="mt-4 text-black/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
