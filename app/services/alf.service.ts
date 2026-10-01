import { api } from "@/lib/api";

export type ALFSessionStatus =
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export interface ALFUsageStats {
  total_sessions: number;
  completed_sessions: number;
  in_progress_sessions: number;
  started_sessions: number;
  abandoned_sessions: number;
  total_duration_seconds: number;
  average_duration_seconds: number;
  completion_rate: number;
}

export interface ALFUsageSession {
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

export interface ALFLessonUsage {
  lesson_id: string;
  lesson_title: string;
  subject_name: string;

  total_sessions: number;
  completed_sessions: number;
  active_sessions: number;

  total_duration_seconds: number;
  average_duration_seconds: number;

  completion_rate: number;
}

export interface ALFTeacherUsage {
  teacher_id: string;
  teacher_name: string;

  total_sessions: number;
  completed_sessions: number;
  active_sessions: number;

  total_duration_seconds: number;
  average_duration_seconds: number;

  completion_rate: number;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

class ALFService {
  private readonly baseUrl = "/school-admin/alf";

  async getStats(): Promise<ALFUsageStats> {
    const response = await api.get<ALFUsageStats | ApiResponse<ALFUsageStats>>(
      `${this.baseUrl}/stats`,
    );

    return this.unwrap(response.data);
  }

  async getUsage(params?: {
    teacher_id?: string;
    lesson_id?: string;
    class_id?: string;
    status?: ALFSessionStatus;
  }): Promise<ALFUsageSession[]> {
    const response = await api.get<
      ALFUsageSession[] | ApiResponse<ALFUsageSession[]>
    >(`${this.baseUrl}/usage`, {
      params,
    });

    return this.unwrap(response.data) ?? [];
  }

  async getSession(sessionId: string): Promise<ALFUsageSession> {
    const response = await api.get<
      ALFUsageSession | ApiResponse<ALFUsageSession>
    >(`${this.baseUrl}/usage/${sessionId}`);

    return this.unwrap(response.data);
  }

  async getLessonUsage(lessonId: string): Promise<ALFLessonUsage> {
    const response = await api.get<
      ALFLessonUsage | ApiResponse<ALFLessonUsage>
    >(`${this.baseUrl}/lessons/${lessonId}/usage`);

    return this.unwrap(response.data);
  }

  async getTeacherUsage(teacherId: string): Promise<ALFTeacherUsage> {
    const response = await api.get<
      ALFTeacherUsage | ApiResponse<ALFTeacherUsage>
    >(`${this.baseUrl}/teachers/${teacherId}/usage`);

    return this.unwrap(response.data);
  }

  private unwrap<T>(response: T | ApiResponse<T>): T {
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data !== undefined
    ) {
      return response.data;
    }

    return response as T;
  }
}

export const alfService = new ALFService();
