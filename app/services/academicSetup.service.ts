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
 * TEMPLATE TYPES
 * =========================================================== */

export const CLASS_LEVELS = [
  "PRE_NURSERY",
  "NURSERY",
  "PRIMARY",
  "JUNIOR_SECONDARY",
  "SENIOR_SECONDARY",
] as const;

export type ClassLevel = (typeof CLASS_LEVELS)[number];

export function formatLevel(level: string) {
  return level
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

export class AcademicSetupService {
  // ==========================================================
  // TEMPLATE
  // ==========================================================

  static async getTemplates(): Promise<AcademicTemplateResponse[]> {
    const response = await api.get("/academic-setup/templates");

    return response.data;
  }

  // ==========================================================
  // SCHOOL SETUP
  // ==========================================================

  static async getSchoolSetup(): Promise<SchoolAcademicSetup> {
    const response = await api.get("/academic-setup/school");

    return response.data;
  }

  static async configure(
    payload: ConfigureAcademicSetupRequest,
  ): Promise<AcademicSetupSummary> {
    const response = await api.post("/academic-setup/configure", payload);

    return response.data;
  }

  static async updateSetup(
    payload: ConfigureAcademicSetupRequest,
  ): Promise<AcademicSetupSummary> {
    const response = await api.put("/academic-setup", payload);

    return response.data;
  }

  // ==========================================================
  // CLASS CRUD
  // ==========================================================

  static async createClass(payload: CreateClassRequest): Promise<SchoolClass> {
    const response = await api.post("/academic-setup/classes", payload);

    return response.data;
  }

  static async updateClass(
    classId: string,
    payload: UpdateClassRequest,
  ): Promise<SchoolClass> {
    const response = await api.patch(
      `/academic-setup/classes/${classId}`,
      payload,
    );

    return response.data;
  }

  static async deleteClass(classId: string): Promise<DeleteResponse> {
    const { data } = await api.delete(`/academic-setup/classes/${classId}`);

    return data;
  }

  // ==========================================================
  // SUBJECT CRUD
  // ==========================================================

  static async createSubject(
    payload: CreateSubjectRequest,
  ): Promise<SchoolSubject> {
    const response = await api.post("/academic-setup/subjects", payload);

    return response.data;
  }

  static async updateSubject(
    subjectId: string,
    payload: UpdateSubjectRequest,
  ): Promise<SchoolSubject> {
    const response = await api.patch(
      `/academic-setup/subjects/${subjectId}`,
      payload,
    );

    return response.data;
  }

  static async deleteSubject(subjectId: string): Promise<DeleteResponse> {
    const { data } = await api.delete(`/academic-setup/subjects/${subjectId}`);

    return data;
  }

  // ==========================================================
  // CLASS SUBJECTS
  // ==========================================================

  static async assignSubjects(
    classId: string,
    payload: AssignSubjectsRequest,
  ): Promise<AssignSubjectsResponse> {
    const { data } = await api.put(
      `/academic-setup/classes/${classId}/subjects`,
      payload,
    );

    return data;
  }
  /* ===========================================================
   * SCHOOL ACADEMIC PERIOD
   * =========================================================== */

  static async getAcademicPeriodOptions(): Promise<AcademicPeriodOptionsResponse> {
    const response = await api.get("/school-admin/academic-period/options");

    return response.data;
  }

  static async getCurrentAcademicPeriod(): Promise<SchoolAcademicPeriodResponse | null> {
    const response = await api.get("/school-admin/academic-period/current");

    return response.data;
  }

  static async updateCurrentAcademicPeriod(
    payload: UpdateSchoolAcademicPeriodRequest,
  ): Promise<SchoolAcademicPeriodResponse> {
    const response = await api.put(
      "/school-admin/academic-period/current",
      payload,
    );

    return response.data;
  }
}
