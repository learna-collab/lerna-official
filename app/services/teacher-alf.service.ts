/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export type ALFSessionStatus =
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export interface ALFSessionResponse {
  id: string;
  teacher_id: string;
  teacher_name: string;

  lesson_id: string;
  lesson_title: string;
  subject_name: string;

  class_id: string;
  class_name: string;

  started_at: string;
  last_activity_at: string;
  completed_at: string | null;

  duration_seconds: number;
  status: ALFSessionStatus;

  independent_reading_completed: boolean;
  mini_lesson_completed: boolean;
  case_study_completed: boolean;
  project_based_learning_completed: boolean;
  evaluation_completed: boolean;

  progress_percentage: number;
}

export interface StartALFSessionPayload {
  class_id: string;
}

export interface UpdateALFProgressPayload {
  independent_reading_completed?: boolean;
  mini_lesson_completed?: boolean;
  case_study_completed?: boolean;
  project_based_learning_completed?: boolean;
  evaluation_completed?: boolean;
}

function unwrap<T>(response: any): T {
  return response?.data?.data ?? response?.data ?? response;
}

export const TeacherALFService = {
  async startSession(
    lessonId: string,
    payload: StartALFSessionPayload,
  ): Promise<ALFSessionResponse> {
    const response = await api.post(
      `/teacher/alf/lessons/${lessonId}/start`,
      payload,
    );

    return unwrap<ALFSessionResponse>(response);
  },

  async updateProgress(
    sessionId: string,
    payload: UpdateALFProgressPayload,
  ): Promise<ALFSessionResponse> {
    const response = await api.patch(
      `/teacher/alf/sessions/${sessionId}`,
      payload,
    );

    return unwrap<ALFSessionResponse>(response);
  },

  async completeSession(sessionId: string): Promise<ALFSessionResponse> {
    const response = await api.post(
      `/teacher/alf/sessions/${sessionId}/complete`,
    );

    return unwrap<ALFSessionResponse>(response);
  },

  async getSession(sessionId: string): Promise<ALFSessionResponse> {
    const response = await api.get(`/teacher/alf/sessions/${sessionId}`);

    return unwrap<ALFSessionResponse>(response);
  },

  async getSessions(params?: {
    classId?: string;
    lessonId?: string;
    status?: ALFSessionStatus;
  }): Promise<ALFSessionResponse[]> {
    const response = await api.get("/teacher/alf/sessions", {
      params: {
        class_id: params?.classId,
        lesson_id: params?.lessonId,
        status: params?.status,
      },
    });

    return unwrap<ALFSessionResponse[]>(response);
  },
};
