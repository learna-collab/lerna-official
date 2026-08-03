/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle2, ImagePlus, Sparkles, Trash2 } from "lucide-react";

import { uploadImage } from "./image-upload";
import RichEditor from "./rich-editor";
import { BlogService } from "@/app/services/blog.services";

type Props = {
  blog?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    cover_image_id?: string | null;
    published: boolean;
    featured: boolean;
    seo_title: string | null;
    seo_description: string | null;
  };
};

export default function BlogForm({ blog }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [content, setContent] = useState(blog?.content ?? "");

  const [coverImage, setCoverImage] = useState(blog?.cover_image ?? "");
  const [coverImageId, setCoverImageId] = useState(blog?.cover_image_id ?? "");

  const [published, setPublished] = useState(blog?.published ?? false);
  const [featured, setFeatured] = useState(blog?.featured ?? false);

  const [seoTitle, setSeoTitle] = useState(blog?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    blog?.seo_description ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const plainText = useMemo(() => {
    return content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [content]);

  const wordCount = useMemo(() => {
    return plainText ? plainText.split(" ").length : 0;
  }, [plainText]);

  const readingMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const completionScore = useMemo(() => {
    let score = 0;

    if (title.trim().length >= 10) score += 20;
    if (excerpt.trim().length >= 40) score += 20;
    if (plainText.length >= 300) score += 30;
    if (coverImage) score += 10;
    if (seoTitle.trim().length >= 20) score += 10;
    if (seoDescription.trim().length >= 50) score += 10;

    return score;
  }, [title, excerpt, plainText, coverImage, seoTitle, seoDescription]);

  const handleImageUpload = async (file: File) => {
    const toastId = toast.loading("Uploading image...");

    try {
      setUploading(true);

      const result = await uploadImage(file);

      setCoverImage(result.url);
      setCoverImageId(result.public_id);

      toast.success("Cover image uploaded successfully", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (title.trim().length < 10) {
      toast.error("Blog title should be at least 10 characters");
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Please enter a short summary");
      return;
    }

    if (excerpt.trim().length < 40) {
      toast.error("Summary should be at least 40 characters");
      return;
    }

    if (!plainText || plainText.length < 300) {
      toast.error("Blog content should be at least 300 characters");
      return;
    }

    const toastId = toast.loading(
      blog ? "Updating article..." : "Publishing article...",
    );

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage || null,
        coverImageId: coverImageId || null,
        published,
        featured,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
      };

      if (blog) {
        await BlogService.updateBlog(blog.id, payload);
      } else {
        await BlogService.createBlog(payload);
      }

      toast.success(
        blog
          ? "Article updated successfully"
          : "Article published successfully",
        {
          id: toastId,
        },
      );

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.detail || err?.message || "Failed to save article",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* HEADER */}
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Professional Article Editor
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {blog ? "Edit Blog Article" : "Create New Blog Article"}
            </h2>

            <p className="max-w-2xl text-sm text-gray-600">
              Write clear, engaging, and professionally formatted content for
              your readers. Use headings, lists, quotes, and images to improve
              readability.
            </p>
          </div>

          <div className="min-w-[240px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Article Quality</span>
              <span className="font-semibold text-gray-900">
                {completionScore}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-blue transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Words</span>
                <span className="font-medium">{wordCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Reading time</span>
                <span className="font-medium">{readingMinutes} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Status</span>
                <span
                  className={`font-medium ${
                    published ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TITLE + EXCERPT */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Article Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a compelling headline that attracts readers"
              className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-3xl font-bold tracking-tight text-gray-900 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100 md:text-4xl"
            />

            <p className="text-xs text-gray-500">
              Aim for 50-70 characters for best readability and SEO.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Summary / Excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a concise summary that appears in blog cards and search results"
              rows={4}
              className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-700 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Recommended: 120-180 characters</span>
              <span>{excerpt.length} characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* COVER IMAGE */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cover Image</h3>
            <p className="text-sm text-gray-600">
              Upload a high-quality landscape image (recommended 1600×900).
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-brand-blue hover:bg-blue-50/30">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <ImagePlus className="h-7 w-7 text-gray-500" />
            </div>

            <div>
              <p className="font-medium text-gray-800">Upload cover image</p>
              <p className="text-sm text-gray-500">
                JPG, PNG or WebP up to 5MB
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageUpload(file);
              }}
              className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-blue/90"
            />
          </div>
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            Uploading image...
          </div>
        )}

        {coverImage && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={coverImage}
                alt="Cover preview"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Cover image ready
              </div>

              <button
                type="button"
                onClick={() => {
                  setCoverImage("");
                  setCoverImageId("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Article Content
            </h3>
            <p className="text-sm text-gray-600">
              Use headings, lists, quotes, links, and images to create a
              polished article.
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
            {wordCount} words
          </div>
        </div>

        <RichEditor value={content} onChange={setContent} />
      </div>

      {/* SEO */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
          <p className="text-sm text-gray-600">
            Improve how your article appears in search engines and social
            sharing.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              SEO Title
            </label>

            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Optimized search engine title"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Recommended: 50-60 characters</span>
              <span>{seoTitle.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              SEO Description
            </label>

            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Short description for search engines and social previews"
              rows={4}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Recommended: 140-160 characters</span>
              <span>{seoDescription.length}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search Preview
            </p>

            <div className="mt-3 space-y-1">
              <p className="text-lg font-medium text-blue-700">
                {seoTitle || title || "Article title preview"}
              </p>

              <p className="text-sm text-green-700">lerna.ng/blogs/article</p>

              <p className="text-sm text-gray-600">
                {seoDescription ||
                  excerpt ||
                  "Your search engine description will appear here."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PUBLISH OPTIONS */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Publishing Options
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-brand-blue hover:bg-blue-50/30">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />

            <div>
              <p className="font-medium text-gray-900">Publish immediately</p>
              <p className="text-sm text-gray-600">
                Make this article visible on the public website.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-brand-blue hover:bg-blue-50/30">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />

            <div>
              <p className="font-medium text-gray-900">Feature this article</p>
              <p className="text-sm text-gray-600">
                Show this article in featured sections across the site.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="sticky bottom-4 z-20 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            {published
              ? "This article will be visible to readers immediately after saving."
              : "This article will be saved as a draft until you publish it."}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="inline-flex items-center justify-center rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? blog
                  ? "Updating..."
                  : "Publishing..."
                : blog
                  ? "Update Article"
                  : published
                    ? "Publish Article"
                    : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
