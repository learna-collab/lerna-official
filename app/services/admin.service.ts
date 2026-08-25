/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

// ==========================================
// SCHOOL PAYLOADS
// ==========================================

export interface CreateSchoolPayload {
  school_name: string;
  website?: string;
  phone: string;
  whatsapp_number?: string;
  state: string;
  address: string;
  description?: string;

  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
}

export interface UpdateSchoolPayload {
  school_name: string;
  website?: string;
  phone: string;
  whatsapp_number?: string;
  state: string;
  address: string;
  description?: string;

  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
}

// ==========================================
// SCHOOL TYPES
// ==========================================

export interface SchoolAdmin {
  id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  username: string | null;
  password?: string | null;
}

export interface School {
  id: string;
  name: string;
  slug: string;

  email: string | null;
  phone: string | null;
  state: string | null;
  website: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  description?: string | null;

  subscription_plan: string | null;
  is_active: boolean;

  admin: SchoolAdmin;
}

// ==========================================
// PAGINATION
// ==========================================

export interface GetSchoolsParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedSchoolsResponse {
  items: School[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ==========================================
// SERVICE
// ==========================================

export const AdminService = {
  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  createSchool: async (payload: CreateSchoolPayload) => {
    const { data } = await api.post("/admin/schools", payload);

    return data;
  },

  // ==========================================
  // GET SCHOOLS
  // SEARCH + PAGINATION
  // ==========================================

  getSchools: async (
    params?: GetSchoolsParams,
  ): Promise<PaginatedSchoolsResponse> => {
    const { data } = await api.get("/admin/schools", {
      params: {
        search: params?.search || undefined,
        page: params?.page || 1,
        per_page: params?.per_page || 10,
      },
    });

    return data;
  },

  // ==========================================
  // UPDATE SCHOOL
  // ==========================================

  updateSchool: async (schoolId: string, payload: UpdateSchoolPayload) => {
    const { data } = await api.put(`/admin/schools/${schoolId}`, payload);

    return data;
  },

  // ==========================================
  // DOWNLOAD SCHOOLS EXCEL
  // ==========================================

  downloadSchoolsExcel: async (search?: string): Promise<Blob> => {
    const { data } = await api.get("/admin/schools/export", {
      params: {
        search: search || undefined,
      },
      responseType: "blob",
    });

    return data;
  },

  // ==========================================
  // DELETE SCHOOL
  // ==========================================

  deleteSchool: async (schoolId: string) => {
    const { data } = await api.delete(`/admin/schools/${schoolId}`);

    return data;
  },

  // ==========================================
  // DISABLE SCHOOL
  // ==========================================

  disableSchool: async (schoolId: string) => {
    const { data } = await api.patch(`/admin/schools/${schoolId}/disable`);

    return data;
  },

  // ==========================================
  // ENABLE SCHOOL
  // ==========================================

  enableSchool: async (schoolId: string) => {
    const { data } = await api.patch(`/admin/schools/${schoolId}/enable`);

    return data;
  },

  // ==========================================
  // DASHBOARD
  // ==========================================

  getStats: async () => {
    const { data } = await api.get("/admin/stats");

    return data;
  },

  // ==========================================
  // ADMINS
  // ==========================================

  getAdmins: async () => {
    const { data } = await api.get("/admin/admins");

    return data;
  },

  createSchoolAdmin: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    school_id: string;
  }) => {
    const { data } = await api.post("/admin/create-school-admin", payload);

    return data;
  },

  deleteAdmin: async (userId: string) => {
    const { data } = await api.delete(`/admin/admins/${userId}`);

    return data;
  },

  assignSchoolAdmin: async (userId: string, schoolId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/assign-school-admin/${schoolId}`,
    );

    return data;
  },

  revokeSchoolAdmin: async (userId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/revoke-school-admin`,
    );

    return data;
  },

  // ==========================================
  // USERS
  // ==========================================

  getUsers: async () => {
    const { data } = await api.get("/users");

    return data;
  },

  getUser: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);

    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);

    return data;
  },

  // ==========================================
  // ACADEMIC
  // ==========================================

  getSessions: async () => {
    const { data } = await api.get("/super-admin/academic/sessions");

    return data;
  },

  createSession: async (payload: any) => {
    const { data } = await api.post("/super-admin/academic/sessions", payload);

    return data;
  },

  updateSession: async (sessionId: string, payload: any) => {
    const { data } = await api.put(
      `/super-admin/academic/sessions/${sessionId}`,
      payload,
    );

    return data;
  },

  activateSession: async (sessionId: string) => {
    const { data } = await api.patch(
      `/super-admin/academic/sessions/${sessionId}/activate`,
    );

    return data;
  },

  deactivateSession: async (sessionId: string) => {
    const { data } = await api.patch(
      `/super-admin/academic/sessions/${sessionId}/deactivate`,
    );

    return data;
  },

  deleteSession: async (sessionId: string) => {
    const { data } = await api.delete(
      `/super-admin/academic/sessions/${sessionId}`,
    );

    return data;
  },

  getTerms: async () => {
    const { data } = await api.get("/super-admin/academic/terms");

    return data;
  },

  createTerm: async (payload: any) => {
    const { data } = await api.post("/super-admin/academic/terms", payload);

    return data;
  },

  updateTerm: async (termId: string, payload: any) => {
    const { data } = await api.put(
      `/super-admin/academic/terms/${termId}`,
      payload,
    );

    return data;
  },

  activateTerm: async (termId: string) => {
    const { data } = await api.patch(
      `/super-admin/academic/terms/${termId}/activate`,
    );

    return data;
  },

  deactivateTerm: async (termId: string) => {
    const { data } = await api.patch(
      `/super-admin/academic/terms/${termId}/deactivate`,
    );

    return data;
  },

  deleteTerm: async (termId: string) => {
    const { data } = await api.delete(`/super-admin/academic/terms/${termId}`);

    return data;
  },
};
