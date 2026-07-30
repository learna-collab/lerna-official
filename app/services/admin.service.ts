/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

export interface CreateSchoolPayload {
  // ==========================
  // SCHOOL
  // ==========================

  school_name: string;
  website?: string;
  phone: string;
  whatsapp_number?: string;
  state: string;
  address: string;
  description?: string;

  // ==========================
  // SCHOOL ADMIN
  // ==========================

  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_password: string;
}

// ==========================================
// ACADEMIC TYPES
// ==========================================

export interface SessionPayload {
  name: string;
  start_date: string;
  end_date: string;
}

export interface SessionResponse extends SessionPayload {
  id: string;
  is_active: boolean;
}

export interface TermPayload {
  name: string;
  sort_order?: number;
}

export interface TermResponse extends TermPayload {
  id: string;
  is_active: boolean;
}

export const AdminService = {
  // ==========================================
  // SCHOOLS
  // ==========================================

  createSchool: async (payload: CreateSchoolPayload) => {
    const { data } = await api.post("/admin/schools", payload);

    return data;
  },

  getSchools: async () => {
    const { data } = await api.get("/admin/schools");

    return data;
  },

  deleteSchool: async (schoolId: string) => {
    const { data } = await api.delete(`/admin/schools/${schoolId}`);

    return data;
  },

  disableSchool: async (schoolId: string) => {
    const { data } = await api.patch(`/admin/schools/${schoolId}/disable`);

    return data;
  },

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
  // SUPER ADMIN ACADEMIC - SESSIONS
  // ==========================================

  getSessions: async (): Promise<SessionResponse[]> => {
    const { data } = await api.get("/super-admin/academic/sessions");

    return data;
  },

  createSession: async (payload: SessionPayload): Promise<SessionResponse> => {
    const { data } = await api.post("/super-admin/academic/sessions", payload);

    return data;
  },

  updateSession: async (
    sessionId: string,
    payload: SessionPayload,
  ): Promise<SessionResponse> => {
    const { data } = await api.put(
      `/super-admin/academic/sessions/${sessionId}`,
      payload,
    );

    return data;
  },

  activateSession: async (sessionId: string): Promise<SessionResponse> => {
    const { data } = await api.patch(
      `/super-admin/academic/sessions/${sessionId}/activate`,
    );

    return data;
  },

  deactivateSession: async (sessionId: string): Promise<SessionResponse> => {
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

  // ==========================================
  // SUPER ADMIN ACADEMIC - TERMS
  // ==========================================

  getTerms: async (): Promise<TermResponse[]> => {
    const { data } = await api.get("/super-admin/academic/terms");

    return data;
  },

  createTerm: async (payload: TermPayload): Promise<TermResponse> => {
    const { data } = await api.post("/super-admin/academic/terms", payload);

    return data;
  },

  updateTerm: async (
    termId: string,
    payload: TermPayload,
  ): Promise<TermResponse> => {
    const { data } = await api.put(
      `/super-admin/academic/terms/${termId}`,
      payload,
    );

    return data;
  },

  activateTerm: async (termId: string): Promise<TermResponse> => {
    const { data } = await api.patch(
      `/super-admin/academic/terms/${termId}/activate`,
    );

    return data;
  },

  deactivateTerm: async (termId: string): Promise<TermResponse> => {
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
