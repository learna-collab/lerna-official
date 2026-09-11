/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

/* ===========================================================
 * SCHOOL ACADEMIC PERIOD
 * =========================================================== */

export interface AcademicPeriodOption {
  id: string;
  name: string;
}

export interface AcademicPeriodOptionsResponse {
  sessions: AcademicPeriodOption[];
  terms: AcademicPeriodOption[];
}

export interface SchoolAcademicPeriodResponse {
  session_id: string;
  session_name: string;
  term_id: string;
  term_name: string;
}

export interface UpdateSchoolAcademicPeriodRequest {
  session_id: string;
  term_id: string;
}

/* ===========================================================
 * ACADEMIC LEVELS
 *
 * These MUST match the backend ClassLevel enum / seeder.
 *
 * Backend templates currently use:
 * NURSERY
 * PRIMARY
 * SECONDARY
 * =========================================================== */

export const CLASS_LEVELS = ["NURSERY", "PRIMARY", "SECONDARY"] as const;

export type ClassLevel = (typeof CLASS_LEVELS)[number];

export function formatLevel(level: string): string {
  return level
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ===========================================================
 * TEMPLATE TYPES
 * =========================================================== */

export interface SubjectTemplate {
  id: string;
  name: string;
  code?: string | null;
  level: string;
}

export interface ClassTemplate {
  id: string;
  name: string;
  level: ClassLevel;
  sort_order: number;
  subjects: SubjectTemplate[];
}

export interface AcademicTemplateResponse {
  id: string;
  name: string;
  description?: string | null;
  classes: ClassTemplate[];
}

/* ===========================================================
 * CONFIGURE SETUP
 * =========================================================== */

export interface ConfigureSubjectRequest {
  template_subject_id?: string | null;
  name: string;
  code?: string | null;
  enabled: boolean;
  is_custom: boolean;
}

export interface ConfigureClassRequest {
  template_class_id?: string | null;
  name: string;
  level: ClassLevel;
  sort_order: number;
  enabled: boolean;
  is_custom: boolean;
  subjects: ConfigureSubjectRequest[];
}

export interface ConfigureAcademicSetupRequest {
  academic_template_id: string;
  classes: ConfigureClassRequest[];
}

/* ===========================================================
 * SCHOOL SETUP
 * =========================================================== */

export interface SchoolSubject {
  id: string;
  template_subject_id?: string | null;
  name: string;
  code?: string | null;
  is_custom: boolean;
}

export interface SchoolClass {
  id: string;
  template_class_id?: string | null;
  name: string;
  level: ClassLevel;
  sort_order: number;
  is_custom: boolean;
  subjects: SchoolSubject[];
}

export interface SchoolAcademicSetup {
  configured: boolean;
  classes: SchoolClass[];
}

/* ===========================================================
 * CONFIGURE RESPONSE
 * =========================================================== */

export interface AcademicSetupSummary {
  classes_created: number;
  subjects_created: number;
  mappings_created: number;
  message: string;
  setup: SchoolAcademicSetup;
}

/* ===========================================================
 * CLASS CRUD
 * =========================================================== */

export interface CreateClassRequest {
  name: string;
  level: ClassLevel;
  sort_order?: number;
}

export interface UpdateClassRequest {
  name?: string;
  level?: ClassLevel;
  sort_order?: number;
}

/* ===========================================================
 * SUBJECT CRUD
 * =========================================================== */

export interface CreateSubjectRequest {
  name: string;
  code?: string | null;
}

export interface UpdateSubjectRequest {
  name: string;
  code?: string | null;
}

/* ===========================================================
 * ASSIGN SUBJECTS
 * =========================================================== */

export interface AssignSubjectsRequest {
  subject_ids: string[];
}

export interface DeleteResponse {
  message: string;
}

export interface AssignSubjectsResponse {
  message: string;
  count: number;
}

/* ===========================================================
 * SERVICE
 * =========================================================== */

export class AcademicSetupService {
  /* ==========================================================
   * TEMPLATE
   * ========================================================== */

  static async getTemplates(): Promise<AcademicTemplateResponse[]> {
    const response = await api.get<AcademicTemplateResponse[]>(
      "/academic-setup/templates",
    );

    return response.data;
  }

  /* ==========================================================
   * SCHOOL SETUP
   * ========================================================== */

  static async getSchoolSetup(): Promise<SchoolAcademicSetup> {
    const response = await api.get<SchoolAcademicSetup>(
      "/academic-setup/school",
    );

    return response.data;
  }

  static async configure(
    payload: ConfigureAcademicSetupRequest,
  ): Promise<AcademicSetupSummary> {
    const response = await api.post<AcademicSetupSummary>(
      "/academic-setup/configure",
      payload,
    );

    return response.data;
  }

  static async updateSetup(
    payload: ConfigureAcademicSetupRequest,
  ): Promise<AcademicSetupSummary> {
    const response = await api.put<AcademicSetupSummary>(
      "/academic-setup",
      payload,
    );

    return response.data;
  }

  /* ==========================================================
   * CLASS CRUD
   * ========================================================== */

  static async createClass(payload: CreateClassRequest): Promise<SchoolClass> {
    const response = await api.post<SchoolClass>(
      "/academic-setup/classes",
      payload,
    );

    return response.data;
  }

  static async updateClass(
    classId: string,
    payload: UpdateClassRequest,
  ): Promise<SchoolClass> {
    const response = await api.patch<SchoolClass>(
      `/academic-setup/classes/${classId}`,
      payload,
    );

    return response.data;
  }

  static async deleteClass(classId: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(
      `/academic-setup/classes/${classId}`,
    );

    return response.data;
  }

  /* ==========================================================
   * SUBJECT CRUD
   * ========================================================== */

  static async createSubject(
    payload: CreateSubjectRequest,
  ): Promise<SchoolSubject> {
    const response = await api.post<SchoolSubject>(
      "/academic-setup/subjects",
      payload,
    );

    return response.data;
  }

  static async updateSubject(
    subjectId: string,
    payload: UpdateSubjectRequest,
  ): Promise<SchoolSubject> {
    const response = await api.patch<SchoolSubject>(
      `/academic-setup/subjects/${subjectId}`,
      payload,
    );

    return response.data;
  }

  static async deleteSubject(subjectId: string): Promise<DeleteResponse> {
    const response = await api.delete<DeleteResponse>(
      `/academic-setup/subjects/${subjectId}`,
    );

    return response.data;
  }

  /* ==========================================================
   * CLASS SUBJECTS
   * ========================================================== */

  static async assignSubjects(
    classId: string,
    payload: AssignSubjectsRequest,
  ): Promise<AssignSubjectsResponse> {
    const response = await api.put<AssignSubjectsResponse>(
      `/academic-setup/classes/${classId}/subjects`,
      payload,
    );

    return response.data;
  }

  /* ===========================================================
   * SCHOOL ACADEMIC PERIOD
   * =========================================================== */

  static async getAcademicPeriodOptions(): Promise<AcademicPeriodOptionsResponse> {
    const response = await api.get<AcademicPeriodOptionsResponse>(
      "/school-admin/academic-period/options",
    );

    return response.data;
  }

  static async getCurrentAcademicPeriod(): Promise<SchoolAcademicPeriodResponse | null> {
    const response = await api.get<SchoolAcademicPeriodResponse | null>(
      "/school-admin/academic-period/current",
    );

    return response.data;
  }

  static async updateCurrentAcademicPeriod(
    payload: UpdateSchoolAcademicPeriodRequest,
  ): Promise<SchoolAcademicPeriodResponse> {
    const response = await api.put<SchoolAcademicPeriodResponse>(
      "/school-admin/academic-period/current",
      payload,
    );

    return response.data;
  }
}
