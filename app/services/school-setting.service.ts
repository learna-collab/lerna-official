// ======================================================
// ADMIN SETTINGS
// ======================================================

import { api } from "@/lib/api";

export interface SchoolSettingsResponse {
  id: string;

  name: string;
  email: string;
  phone: string;
  address?: string | null;
  website?: string | null;
  state?: string | null;
  description?: string | null;
  contact_person?: string | null;
  whatsapp_number?: string | null;

  logo_url?: string | null;

  subscription_plan: string;
  code: string;
}

export interface UpdateSchoolSettingsRequest {
  name: string;

  email: string;

  phone: string;

  address?: string;

  website?: string;

  state?: string;

  description?: string;

  contact_person?: string;

  whatsapp_number?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const SchoolSettingService = {
  getSettings: async (): Promise<SchoolSettingsResponse> => {
    const { data } = await api.get("/school-admin/settings");

    return data;
  },

  updateSettings: async (
    payload: UpdateSchoolSettingsRequest,
  ): Promise<SchoolSettingsResponse> => {
    const { data } = await api.put("/school-admin/settings", payload);

    return data;
  },

  changePassword: async (
    payload: ChangePasswordRequest,
  ): Promise<{ message: string }> => {
    const { data } = await api.put("/school-admin/settings/password", payload);

    return data;
  },

  uploadLogo: async (
    file: File,
  ): Promise<{
    message: string;
    logo_url: string;
  }> => {
    const formData = new FormData();

    formData.append("logo", file);

    const { data } = await api.post("/school-admin/settings/logo", formData);

    return data;
  },
};
