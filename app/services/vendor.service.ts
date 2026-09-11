import { api } from "@/lib/api";

export class MarketplaceVendorService {
  static async createProfile(payload: {
    vendor_type: "INDIVIDUAL" | "BUSINESS";
    store_name: string;
    business_name?: string;
    description?: string;
    phone?: string;
    public_email?: string;
    address?: string;
    logo_url?: string;
  }) {
    const res = await api.post("/marketplace/vendor/profile", payload);
    return res.data;
  }

  static async getProfile() {
    const res = await api.get("/marketplace/vendor/profile");
    return res.data;
  }

  static async updateProfile(payload: {
    vendor_type?: "INDIVIDUAL" | "BUSINESS";
    store_name?: string;
    business_name?: string;
    description?: string;
    phone?: string;
    public_email?: string;
    address?: string;
    logo_url?: string;
  }) {
    const res = await api.patch("/marketplace/vendor/profile", payload);
    return res.data;
  }

  static async createListing(payload: {
    category_id: string;
    listing_type: "PHYSICAL" | "SERVICE" | "DIGITAL";
    title: string;
    description?: string;
    price: number;
    currency?: string;
    is_featured?: boolean;
  }) {
    const res = await api.post("/marketplace/vendor/listings", payload);
    return res.data;
  }

  static async getListings() {
    const res = await api.get("/marketplace/vendor/listings");
    return res.data;
  }

  static async getListing(listingId: string) {
    const res = await api.get(`/marketplace/vendor/listings/${listingId}`);
    return res.data;
  }

  static async updateListing(
    listingId: string,
    payload: {
      category_id?: string;
      listing_type?: "PHYSICAL" | "SERVICE" | "DIGITAL";
      title?: string;
      description?: string;
      price?: number;
      currency?: string;
      is_featured?: boolean;
    },
  ) {
    const res = await api.patch(
      `/marketplace/vendor/listings/${listingId}`,
      payload,
    );
    return res.data;
  }

  static async addPhysicalProduct(
    listingId: string,
    payload: {
      sku?: string;
      stock_quantity: number;
      weight_kg?: number;
      dimensions?: string;
    },
  ) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/physical`,
      payload,
    );
    return res.data;
  }

  static async addService(
    listingId: string,
    payload: {
      pricing_model?: string;
      duration_minutes?: number;
      service_area?: string;
      availability?: string;
    },
  ) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/service`,
      payload,
    );
    return res.data;
  }

  static async addDigitalProduct(
    listingId: string,
    payload: {
      file_url: string;
      file_type?: string;
      access_type?: string;
      instructions?: string;
    },
  ) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/digital`,
      payload,
    );
    return res.data;
  }

  static async addListingImage(
    listingId: string,
    payload: {
      image_url: string;
      is_primary?: boolean;
      sort_order?: number;
    },
  ) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/images`,
      payload,
    );
    return res.data;
  }

  static async activateListing(listingId: string) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/activate`,
    );
    return res.data;
  }

  static async deactivateListing(listingId: string) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/deactivate`,
    );
    return res.data;
  }

  static async archiveListing(listingId: string) {
    const res = await api.post(
      `/marketplace/vendor/listings/${listingId}/archive`,
    );
    return res.data;
  }
}
