import { api } from "@/lib/api";

import type {
  AnswerApiResponse,
  ApiResponse,
  AttemptApiResponse,
  AttemptListApiResponse,
  CreateExamRequest,
  CreateQuestionRequest,
  ExamApiResponse,
  ExamListApiResponse,
  QuestionApiResponse,
  SubmitAnswerRequest,
} from "@/app/types/cbt";

export class CBTService {
  // ======================================================
  // EXAMS
  // ======================================================

  static async createExam(data: CreateExamRequest): Promise<ExamApiResponse> {
    const response = await api.post<ExamApiResponse>("/cbt/admin/exams", data);

    return response.data;
  }

  static async updateExam(
    examId: string,
    data: CreateExamRequest,
  ): Promise<ExamApiResponse> {
    const response = await api.put<ExamApiResponse>(
      `/cbt/admin/exams/${examId}`,
      data,
    );

    return response.data;
  }

  static async getSchoolExams(): Promise<ExamListApiResponse> {
    const response = await api.get<ExamListApiResponse>("/cbt/admin/exams");

    return response.data;
  }

  static async getExam(examId: string): Promise<ExamApiResponse> {
    const response = await api.get<ExamApiResponse>(
      `/cbt/admin/exams/${examId}`,
    );

    return response.data;
  }

  static async publishExam(examId: string): Promise<ExamApiResponse> {
    const response = await api.patch<ExamApiResponse>(
      `/cbt/admin/exams/${examId}/publish`,
    );

    return response.data;
  }

  static async deleteExam(examId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/cbt/exams/${examId}`);

    return response.data;
  }

  // ======================================================
  // QUESTIONS
  // ======================================================

  static async addQuestion(
    examId: string,
    data: CreateQuestionRequest,
  ): Promise<QuestionApiResponse> {
    const response = await api.post<QuestionApiResponse>(
      `/cbt/admin/exams/${examId}/questions`,
      data,
    );

    return response.data;
  }

  static async getQuestions(examId: string): Promise<QuestionApiResponse> {
    const response = await api.get<QuestionApiResponse>(
      `/cbt/admin/exams/${examId}/questions`,
    );

    return response.data;
  }

  static async updateQuestion(
    questionId: string,
    data: CreateQuestionRequest,
  ): Promise<QuestionApiResponse> {
    const response = await api.put<QuestionApiResponse>(
      `/cbt/admin/questions/${questionId}`,
      data,
    );

    return response.data;
  }

  static async deleteQuestion(questionId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(
      `/cbt/admin/questions/${questionId}`,
    );

    return response.data;
  }

  // ======================================================
  // RESULTS
  // ======================================================

  static async getExamResults(examId: string): Promise<AttemptListApiResponse> {
    const response = await api.get<AttemptListApiResponse>(
      `/cbt/exams/${examId}/results`,
    );

    return response.data;
  }

  // ======================================================
  // STUDENT
  // ======================================================

  static async getAvailableExams(
    classId: string,
  ): Promise<ExamListApiResponse> {
    const response = await api.get<ExamListApiResponse>(
      `/cbt/classes/${classId}/exams`,
    );

    return response.data;
  }

  static async startExam(examId: string): Promise<AttemptApiResponse> {
    const response = await api.post<AttemptApiResponse>(
      `/cbt/exams/${examId}/start`,
    );

    return response.data;
  }

  static async resumeExam(attemptId: string): Promise<AttemptApiResponse> {
    const response = await api.get<AttemptApiResponse>(
      `/cbt/attempts/${attemptId}`,
    );

    return response.data;
  }

  static async submitAnswer(
    data: SubmitAnswerRequest,
  ): Promise<AnswerApiResponse> {
    const response = await api.post<AnswerApiResponse>("/cbt/answers", data);

    return response.data;
  }

  static async submitExam(attemptId: string): Promise<AttemptApiResponse> {
    const response = await api.post<AttemptApiResponse>(
      `/cbt/attempts/${attemptId}/submit`,
    );

    return response.data;
  }

  static async getAttempt(attemptId: string): Promise<AttemptApiResponse> {
    const response = await api.get<AttemptApiResponse>(
      `/cbt/attempts/${attemptId}`,
    );

    return response.data;
  }

  static async getStudentResult(
    attemptId: string,
  ): Promise<AttemptApiResponse> {
    const response = await api.get<AttemptApiResponse>(
      `/cbt/attempts/${attemptId}/result`,
    );

    return response.data;
  }

  static async getStudentHistory(): Promise<AttemptListApiResponse> {
    const response = await api.get<AttemptListApiResponse>("/cbt/history");

    return response.data;
  }
}
