// =====================================================
// REQUESTS
// =====================================================

export interface CreateExamRequest {
  class_id: string;
  subject_id: string;

  title: string;
  instructions?: string;

  duration_minutes: number;
  total_marks: number;

  starts_at: string;
  ends_at: string;
}

export interface QuestionOptionCreate {
  option_text: string;
  is_correct: boolean;
}

export interface CreateQuestionRequest {
  question_text: string;
  marks: number;
  order_no: number;

  options: QuestionOptionCreate[];
}

export interface SubmitAnswerRequest {
  attempt_id: string;
  question_id: string;
  option_id: string;
}

// =====================================================
// MODELS
// =====================================================

export interface QuestionOption {
  id: string;
  option_text: string;

  is_correct: boolean;
}

export interface Question {
  id: string;

  question_text: string;
  marks: number;
  order_no: number;

  options: QuestionOption[];
}
export interface ClassInfo {
  id: string;
  name: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
}

export interface Exam {
  school_class?: ClassInfo;
  subject?: SubjectInfo;
  is_published: boolean;
  id: string;
  question_count?: number;

  title: string;
  instructions?: string;

  duration_minutes: number;
  total_marks: number;

  starts_at: string;
  ends_at: string;
  questions?: Question[];
}

export interface Attempt {
  id: string;

  exam_id: string;
  student_id: string;

  started_at: string;
  completed_at?: string | null;

  score: number;
  percentage: number;
  passed: boolean;
}

export interface Answer {
  id: string;

  attempt_id: string;
  question_id: string;
  option_id: string;
}

// =====================================================
// COLLECTIONS
// =====================================================

export interface ExamList {
  exams: Exam[];
  count: number;
}

export interface AttemptList {
  attempts: Attempt[];
  count: number;
}

// =====================================================
// API RESPONSES
// =====================================================

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ExamApiResponse extends ApiResponse {
  data: Exam | null;
}

export interface ExamListApiResponse extends ApiResponse {
  data: ExamList | null;
}

export interface QuestionApiResponse extends ApiResponse {
  data: Question | null;
}

export interface AttemptApiResponse extends ApiResponse {
  data: Attempt | null;
}

export interface AttemptListApiResponse extends ApiResponse {
  data: AttemptList | null;
}

export interface AnswerApiResponse extends ApiResponse {
  data: Answer | null;
}
