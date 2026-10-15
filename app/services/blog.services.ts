/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

export type BlogAttachment = {
  id?: string;
  filename: string;
  url: string;
  public_id: string;
  content_type?: string | null;
  file_size: number;
};

export const BlogService = {
  createBlog: async (data: any) => {
    const { data: res } = await api.post("/blogs", data);
    return res;
  },

  getBlogs: async () => {
    const { data } = await api.get("/blogs");
    return data;
  },

  getFeaturedBlogs: async () => {
    const { data } = await api.get("/blogs/featured");
    return data;
  },

  getBlog: async (id: string) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
  },

  updateBlog: async (id: string, data: any) => {
    const { data: res } = await api.patch(`/blogs/${id}`, data);
    return res;
  },

  deleteBlog: async (id: string) => {
    const { data: res } = await api.delete(`/blogs/${id}`);
    return res;
  },

  uploadAttachment: async (file: File): Promise<BlogAttachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/blogs/attachments/upload", formData);

    return data;
  },
};
