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

export interface LessonQueryParams {
  classId: string;
  subjectId: string;
  sessionId: string;
  termId: string;
  weekNumber?: number;
}

export const SchoolAdminLessonService = {
  async getLessons(params: LessonQueryParams): Promise<LessonResponse[]> {
    const { data } = await api.get("/school-admin/lessons", {
      params: {
        class_id: params.classId,

        session_id: params.sessionId,
        term_id: params.termId,
        week_number: params.weekNumber,
      },
    });

    return data;
  },

  async getLesson(lessonId: string): Promise<LessonResponse> {
    const { data } = await api.get(`/school-admin/lessons/${lessonId}`);

    return data;
  },

  async getWeekLessons(params: LessonQueryParams): Promise<LessonResponse[]> {
    const { data } = await api.get("/school-admin/lessons", {
      params: {
        class_id: params.classId,
        subject_id: params.subjectId,
        session_id: params.sessionId,
        term_id: params.termId,
        week_number: params.weekNumber,
      },
    });

    return data;
  },
};
