import { api } from "@/lib/api";

export class MarketplaceAdminService {
  static async getVendors(status?: string) {
    const res = await api.get("/marketplace/admin/vendors", {
      params: status ? { status } : undefined,
    });
    return res.data;
  }

  static async getPendingVendors() {
    const res = await api.get("/marketplace/admin/vendors/pending");
    return res.data;
  }

  static async getVendor(vendorId: string) {
    const res = await api.get(`/marketplace/admin/vendors/${vendorId}`);
    return res.data;
  }

  static async approveVendor(vendorId: string) {
    const res = await api.post(
      `/marketplace/admin/vendors/${vendorId}/approve`,
    );
    return res.data;
  }

  static async rejectVendor(vendorId: string) {
    const res = await api.post(`/marketplace/admin/vendors/${vendorId}/reject`);
    return res.data;
  }

  static async suspendVendor(vendorId: string) {
    const res = await api.post(
      `/marketplace/admin/vendors/${vendorId}/suspend`,
    );
    return res.data;
  }

  static async reactivateVendor(vendorId: string) {
    const res = await api.post(
      `/marketplace/admin/vendors/${vendorId}/reactivate`,
    );
    return res.data;
  }
}
