/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogService } from "@/app/services/blog.services";
import BlogForm from "@/components/admin/blog-form";

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await BlogService.getBlog(id);
        setBlog(data);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500 animate-pulse">
          Loading blog...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-red-500">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Edit Blog
          </h1>
          <p className="text-sm text-gray-500">
            Update and manage your article content
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white border rounded-2xl shadow-sm">
          <div className="p-6 md:p-8">
            <BlogForm blog={blog} />
          </div>
        </div>
      </div>
    </div>
  );
}
