/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BlogService } from "@/app/services/blog.services";
import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function BlogPostClient() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await BlogService.getBlog(id);
        setBlog(data);

        // Optional SEO
        if (data?.title) {
          document.title = data.seo_title || data.title;
        }
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) void load();
  }, [id]);

  const readingTime = useMemo(() => {
    if (blog?.reading_time) return blog.reading_time;

    const text =
      blog?.content
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim() || "";

    const words = text ? text.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  }, [blog]);

  const publishedDate = useMemo(() => {
    if (!blog?.created_at) return "";

    return new Date(blog.created_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [blog]);

  async function shareArticle() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {
      // ignore share cancellation
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-12 w-full rounded bg-gray-200" />
            <div className="h-12 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="mt-8 aspect-[16/9] rounded-3xl bg-gray-200" />
            <div className="space-y-3 pt-8">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 w-11/12 rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Article not found
          </h2>
          <p className="mt-2 text-gray-600">
            The article you are looking for may have been removed or is no
            longer available.
          </p>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top spacing */}
      <div className="h-6 bg-gray-50" />

      {/* Article header */}
      <header className="border-b border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <Link
            href="/blogs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue">
              <BookOpen className="h-3.5 w-3.5" />
              Education Insights
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>

              {blog.author?.name && (
                <div className="font-medium text-gray-700">
                  By {blog.author.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {blog.cover_image && (
        <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-12">
          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="h-auto max-h-[620px] w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Content area */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_240px] lg:py-16">
        {/* Article body */}
        <article className="min-w-0">
          <div
            className="max-w-none text-gray-700 leading-8
             [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-6 [&_h1]:text-gray-900
             [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-5 [&_h2]:text-gray-900
             [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-gray-900
             [&_p]:mb-5 [&_p]:leading-8
             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6
             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-6
             [&_li]:mb-2 [&_li]:leading-8
             [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:bg-blue-50 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-6
             [&_a]:text-brand-blue [&_a]:underline
             [&_strong]:font-semibold [&_strong]:text-gray-900
             [&_img]:rounded-2xl [&_img]:shadow-sm [&_img]:my-6
             [&_hr]:my-10 [&_hr]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Share this article
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Help others discover this educational insight.
            </p>

            <button
              onClick={shareArticle}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
            >
              <Share2 className="h-4 w-4" />
              Share article
            </button>

            <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Reading time</span>
                <span className="font-medium text-gray-900">
                  {readingTime} min
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span>Published</span>
                <span className="font-medium text-gray-900">
                  {publishedDate}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Enjoyed this article?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Explore more practical insights for school leaders, teachers,
            parents, and education stakeholders.
          </p>

          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
          >
            Read more articles
          </Link>
        </div>
      </section>
    </main>
  );
}
