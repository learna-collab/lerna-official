/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export interface LessonALFResponse {
  independent_reading?: string | null;
  mini_lesson?: string | null;
  case_study?: string | null;
  project_based_learning?: string | null;
  evaluation?: string | null;
}

export interface LessonResponse {
  id: string;
  week_number: number;
  lesson_day: string;

  class_name: string;
  subject_name: string;

  title: string;
  topic: string;

  objectives?: string | null;
  teacher_notes?: string | null;

  file_url?: string | null;
  is_published: boolean;

  created_at?: string;

  alf?: LessonALFResponse | null;
}

export interface UploadLessonPayload {
  class_template_id: string;
  subject_template_id: string;
  session_id: string;
  term_id: string;
  week_number: number;
  lesson_day?: string;
  file: File;
}

export interface Option {
  id: string;
  name: string;
}

export const SuperAdminLessonService = {
  async uploadLesson(payload: UploadLessonPayload): Promise<LessonResponse> {
    const formData = new FormData();

    formData.append("class_template_id", payload.class_template_id);
    formData.append("subject_template_id", payload.subject_template_id);
    formData.append("session_id", payload.session_id);
    formData.append("term_id", payload.term_id);
    formData.append("week_number", String(payload.week_number));
    if (payload.lesson_day) {
      formData.append("lesson_day", payload.lesson_day);
    }
    formData.append("file", payload.file);

    const { data } = await api.post("/super-admin/lessons/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async getLesson(lessonId: string): Promise<LessonResponse> {
    const { data } = await api.get(`/super-admin/lessons/${lessonId}`);

    return data;
  },

  async publishLesson(
    lessonId: string,
    value: boolean,
  ): Promise<LessonResponse> {
    const { data } = await api.patch(
      `/super-admin/lessons/${lessonId}/publish`,
      { value },
    );

    return data;
  },

  async deleteLesson(lessonId: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/super-admin/lessons/${lessonId}`);

    return data;
  },

  async getLessons(params: {
    classTemplateId: string;
    subjectTemplateId?: string;
    sessionId: string;
    termId: string;
    weekNumber?: number;
  }): Promise<LessonResponse[]> {
    const { data } = await api.get("/super-admin/lessons", {
      params: {
        class_template_id: params.classTemplateId,
        subject_template_id: params.subjectTemplateId,
        session_id: params.sessionId,
        term_id: params.termId,
        week_number: params.weekNumber,
      },
    });

    return data;
  },

  async getClasses(): Promise<Option[]> {
    const { data } = await api.get("/super-admin/lessons/classes");

    return data;
  },

  // NEW: load subjects for a selected class only
  async getClassSubjects(classTemplateId: string): Promise<Option[]> {
    const { data } = await api.get(
      `/super-admin/lessons/classes/${classTemplateId}/subjects`,
    );

    return data;
  },

  async getSessions(): Promise<Option[]> {
    const { data } = await api.get("/super-admin/lessons/sessions");

    return data;
  },

  async getTerms(): Promise<Option[]> {
    const { data } = await api.get("/super-admin/lessons/terms");

    return data;
  },
};
