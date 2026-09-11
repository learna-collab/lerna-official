import { api } from "@/lib/api";

export class MarketplacePublicService {
  static async getCategories() {
    const res = await api.get("/marketplace/categories");

    return res.data;
  }

  static async getCategory(slug: string) {
    const res = await api.get(`/marketplace/categories/${slug}`);

    return res.data;
  }

  static async getCategoryListings(slug: string) {
    const res = await api.get(`/marketplace/categories/${slug}/listings`);

    return res.data;
  }

  static async getStore(slug: string) {
    const res = await api.get(`/marketplace/stores/${slug}`);

    return res.data;
  }

  static async getListings(params?: {
    listing_type?: "PHYSICAL" | "SERVICE" | "DIGITAL";
    category_id?: string;
  }) {
    const res = await api.get("/marketplace/listings", {
      params,
    });

    return res.data;
  }

  static async getListing(slug: string) {
    const res = await api.get(`/marketplace/listings/${slug}`);

    return res.data;
  }

  static async getStoreListings(slug: string) {
    const res = await api.get(`/marketplace/stores/${slug}/listings`);

    return res.data;
  }
}
