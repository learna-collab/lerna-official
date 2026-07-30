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
  id: string;

  title: string;
  instructions?: string;

  duration_minutes: number;
  total_marks: number;

  is_published: boolean;

  question_count?: number;

  school_class?: ClassInfo;
  subject?: SubjectInfo;

  questions?: Question[];
}

export interface StudentInfo {
  id: string;
  first_name: string;
  last_name: string;
  admission_number?: string;
}

export interface Attempt {
  id: string;

  exam_id: string;
  student_id: string;

  started_at: string;
  submitted_at?: string | null;

  score: number;
  percentage: number;
  is_passed: boolean;

  student?: StudentInfo;

  answered_questions?: number;

  exam?: Exam;
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

// =====================================================
// RESULTS DASHBOARD
// =====================================================

export interface CBTResultsDashboardStats {
  total_exams: number;

  total_attempts: number;

  average_percentage: number;

  overall_pass_rate: number;
}

export interface CBTResultsDashboardItem {
  exam_id: string;

  title: string;

  class_name: string;

  subject_name: string;

  attempts: number;

  average_score: number;

  average_percentage: number;

  highest_score: number;

  lowest_score: number;

  pass_rate: number;

  total_marks: number;

  published: boolean;
}

export interface CBTResultsDashboard {
  results: CBTResultsDashboardItem[];

  count: number;

  stats: CBTResultsDashboardStats;
}

export interface CBTResultsDashboardApiResponse extends ApiResponse {
  data: CBTResultsDashboard | null;
}

// =====================================================
// STUDENT MODELS
// =====================================================

export type ExamAttemptStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface StudentQuestionOption {
  id: string;

  option_label: string;

  option_text: string;

  option_order: number;
}

export interface StudentQuestion {
  id: string;

  question_text: string;

  marks: number;

  order_no: number;

  selected_option_id?: string | null;

  options: StudentQuestionOption[];
}

export interface StudentExam {
  id: string;

  title: string;

  instructions?: string;

  duration_minutes: number;

  total_marks: number;

  class_name: string;

  subject_name: string;

  question_count: number;

  attempt_status: ExamAttemptStatus;

  attempt_id?: string | null;
}

export interface StudentExamAttempt {
  attempt_id: string;

  exam_id: string;

  title: string;
  current_question_index: number;

  instructions?: string;

  duration_minutes: number;

  total_marks: number;

  started_at: string;

  completed_at?: string | null;

  expires_at: string;

  remaining_seconds: number;

  questions: StudentQuestion[];
}

export interface StudentResult {
  attempt_id: string;

  exam_id: string;

  exam_title: string;

  subject_name: string;

  total_marks: number;

  score: number;

  percentage: number;

  passed: boolean;

  total_questions: number;

  answered_questions: number;

  correct_answers: number;

  wrong_answers: number;

  unanswered_questions: number;

  started_at: string;

  completed_at?: string | null;
}

export interface StudentHistoryItem {
  attempt_id: string;

  exam_id: string;

  exam_title: string;

  subject_name: string;

  score: number;

  percentage: number;

  passed: boolean;

  completed_at?: string | null;
}

export interface StudentExamList {
  exams: StudentExam[];

  count: number;
}

export interface StudentHistory {
  attempts: StudentHistoryItem[];

  count: number;
}
export interface StudentExamListApiResponse extends ApiResponse {
  data: StudentExamList | null;
}

export interface StudentExamAttemptApiResponse extends ApiResponse {
  data: StudentExamAttempt | null;
}

export interface StudentResultApiResponse extends ApiResponse {
  data: StudentResult | null;
}

export interface StudentHistoryApiResponse extends ApiResponse {
  data: StudentHistory | null;
}
