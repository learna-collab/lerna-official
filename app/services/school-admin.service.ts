/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { ClassResultResponse } from "./teacher.service";
export interface SubjectItem {
  id: string;
  name: string;
}

export interface TeacherItem {
  id: string;

  first_name: string;

  last_name: string;

  email: string;
}

export interface ClassTemplate {
  name: string;

  level: string;

  sort_order: number;
}

export interface ConfigureClass {
  name: string;

  level: string;

  sort_order: number;
  enabled: boolean;

  subject_ids: string[];

  teacher_ids: string[];
}

export interface SaveAcademicStructureRequest {
  classes: ConfigureClass[];
}

export interface ConfiguredClass {
  id: string;

  name: string;

  level: string;

  sort_order: number;

  subjects: SubjectItem[];

  teachers: TeacherItem[];
}

export interface AcademicStructureResponse {
  classes: ConfiguredClass[];
}

export interface UpdateResultRecordPayload {
  ca_score: number;
  exam_score: number;
  teacher_comment?: string;
}

export interface ResultBatchStatusResponse {
  batch_id: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  message: string;
}

export interface RejectResultRequest {
  note: string;
}

export interface ApprovalHistoryItem {
  id: string;
  action: string;
  note?: string;
  action_at: string;

  actor: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}
export interface SchoolAdminDashboard {
  school_name: string;

  active_session: {
    id: string;
    name: string;
  } | null;

  active_term: {
    id: string;
    name: string;
  } | null;

  overview: {
    students: number;
    teachers: number;
    parents: number;
    classes: number;
    subjects: number;
  };

  attendance: {
    present: number;
    absent: number;
    late: number;
  };

  results: {
    total_batches: number;
    approved_batches: number;
    pending_batches: number;
    published_batches: number;
  };

  recent_students: {
    id: string;
    name: string;
    email: string;
  }[];

  recent_teachers: {
    id: string;
    name: string;
    email: string;
  }[];
}

export const SchoolAdminService = {
  // =========================
  // DASHBOARD
  // =========================

  async getDashboard(): Promise<SchoolAdminDashboard> {
    const { data } = await api.get("/school-admin/dashboard");
    return data;
  },
  getStats: async () => {
    const { data } = await api.get("/school-admin/stats");
    return data;
  },

  // =========================
  // USERS
  // =========================
  getStudents: async (classId: string) => {
    const { data } = await api.get(`/school-admin/${classId}/students`);
    return data;
  },

  getSchoolStudents: async () => {
    const { data } = await api.get(`/school-admin/students`);
    return data;
  },

  getTeachers: async (classId: string) => {
    const { data } = await api.get(`/school-admin/${classId}/teachers`);
    return data;
  },

  getSchoolTeachers: async () => {
    const { data } = await api.get(`/school-admin/teachers`);
    return data;
  },

  // =========================
  // CLASSES
  // =========================
  getClasses: async () => {
    const { data } = await api.get("/school-admin/classes");
    return data;
  },

  getClassDashboard: async (classId: string) => {
    const { data } = await api.get(
      `/school-admin/classes/${classId}/dashboard`,
    );

    return data;
  },

  createClass: async (payload: { name: string; level?: string }) => {
    const { data } = await api.post("/school-admin/classes", payload);
    return data;
  },

  deleteClass: async (id: string) => {
    const { data } = await api.delete(`/school-admin/classes/${id}`);
    return data;
  },

  // =========================
  // CLASS ASSIGNMENTS
  // =========================

  assignStudentToClass: async (classId: string, studentId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/assign-student/${studentId}`,
    );

    return data;
  },

  assignTeacherToClass: async (classId: string, teacherId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/assign-teacher/${teacherId}`,
    );

    return data;
  },

  removeStudentFromClass: async (classId: string, studentId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/students/${studentId}`,
    );

    return data;
  },

  removeTeacherFromClass: async (classId: string, teacherId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/teachers/${teacherId}`,
    );

    return data;
  },

  // =========================
  // CLASS MEMBERS
  // =========================

  getClassStudents: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/students`);
    return data;
  },

  getClassTeachers: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/teachers`);
    return data;
  },

  // =====================
  // SUBJECTS
  // =====================
  getSubjects: async () => {
    const { data } = await api.get("/school-admin/subjects");
    return data;
  },

  createSubject: async (payload: { name: string }) => {
    const { data } = await api.post("/school-admin/subjects", payload);
    return data;
  },

  assignSubjectToClass: async (classId: string, subjectId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/subjects/${subjectId}`,
    );

    return data;
  },

  removeSubjectFromClass: async (classId: string, subjectId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/subjects/${subjectId}`,
    );

    return data;
  },

  getClassSubjects: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/subjects`);

    return data;
  },
  // ====================================================
  // CLASS SUBJECT TEACHER ASSIGNMENTS
  // ====================================================

  assignTeacherToSubject: async (
    classId: string,
    subjectId: string,
    teacherId: string,
  ) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/subjects/${subjectId}/assign-teacher/${teacherId}`,
    );

    return data;
  },

  removeTeacherFromSubject: async (
    classId: string,
    subjectId: string,
    teacherId: string,
  ) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/subjects/${subjectId}/teachers/${teacherId}`,
    );

    return data;
  },

  // =========================
  // RESULTS MANAGEMENT
  // =========================

  getClassResults: async (params: {
    classId: string;
    sessionId?: string;
    termId?: string;
  }): Promise<ClassResultResponse> => {
    const { data } = await api.get("/school-admin/results/class", {
      params: {
        class_id: params.classId,
        session_id: params.sessionId,
        term_id: params.termId,
      },
    });

    return data;
  },

  approveResult: async (
    batchId: string,
  ): Promise<ResultBatchStatusResponse> => {
    const { data } = await api.post(`/school-admin/results/${batchId}/approve`);

    return data;
  },

  rejectResult: async (
    batchId: string,
    payload: RejectResultRequest,
  ): Promise<ResultBatchStatusResponse> => {
    const { data } = await api.post(
      `/school-admin/results/${batchId}/reject`,
      payload,
    );

    return data;
  },

  publishResult: async (
    batchId: string,
  ): Promise<ResultBatchStatusResponse> => {
    const { data } = await api.post(`/school-admin/results/${batchId}/publish`);

    return data;
  },

  getResultApprovalHistory: async (
    batchId: string,
  ): Promise<ApprovalHistoryItem[]> => {
    const { data } = await api.get(`/school-admin/results/${batchId}/history`);

    return data;
  },

  updateResultRecord: async (
    recordId: string,
    payload: UpdateResultRecordPayload,
  ): Promise<{ message: string }> => {
    const { data } = await api.patch(
      `/school-admin/results/records/${recordId}`,
      payload,
    );

    return data;
  },
  // =========================
  // ATTENDANCE
  // =========================

  getStudentAttendance: async (
    studentId: string,
    sessionId: string,
    termId: string,
  ) => {
    const { data } = await api.get(
      `/school-admin/attendance/student/${studentId}`,
      {
        params: {
          session_id: sessionId,
          term_id: termId,
        },
      },
    );

    return data;
  },

  getClassAttendance: async (classId: string, attendanceDate: string) => {
    const { data } = await api.get("/school-admin/attendance/class", {
      params: {
        class_id: classId,
        attendance_date: attendanceDate,
      },
    });

    return data;
  },

  getAttendanceDashboard: async (attendanceDate: string) => {
    const { data } = await api.get("/school-admin/attendance/dashboard", {
      params: {
        attendance_date: attendanceDate,
      },
    });

    return data;
  },

  getAttendanceAnalytics: async (sessionId: string, termId: string) => {
    const { data } = await api.get("/school-admin/attendance/analytics", {
      params: {
        session_id: sessionId,
        term_id: termId,
      },
    });

    return data;
  },
  getAvailableStudents: async (classId: string) => {
    const { data } = await api.get(
      `/school-admin/classes/${classId}/available-students`,
    );

    return data;
  },

  updateClass: async (
    classId: string,
    payload: {
      name: string;
      level?: string;
    },
  ) => {
    const { data } = await api.put(`/school-admin/classes/${classId}`, payload);

    return data;
  },

  updateSubject: async (
    subjectId: string,
    payload: {
      name: string;
    },
  ) => {
    const { data } = await api.put(
      `/school-admin/subjects/${subjectId}`,
      payload,
    );

    return data;
  },

  deleteSubject: async (subjectId: string) => {
    const { data } = await api.delete(`/school-admin/subjects/${subjectId}`);

    return data;
  },

  updateTeacher: async (teacherId: string, payload: any) => {
    const { data } = await api.put(
      `/school-admin/teachers/${teacherId}`,
      payload,
    );

    return data;
  },

  updateStudent: async (studentId: string, payload: any) => {
    const { data } = await api.put(
      `/school-admin/students/${studentId}`,
      payload,
    );

    return data;
  },

  exportResults: async (classId: string, sessionId: string, termId: string) => {
    const response = await api.get(`/school-admin/results/export`, {
      params: {
        class_id: classId,
        session_id: sessionId,
        term_id: termId,
      },
      responseType: "blob",
    });

    return response.data;
  },

  exportAttendance: async (
    classId: string,
    sessionId: string,
    termId: string,
  ) => {
    const response = await api.get(`/school-admin/attendance/export`, {
      params: {
        class_id: classId,
        session_id: sessionId,
        term_id: termId,
      },
      responseType: "blob",
    });

    return response.data;
  },
  // ======================================================
  // ACADEMIC STRUCTURE
  // ======================================================

  getClassTemplates: async (): Promise<ClassTemplate[]> => {
    const { data } = await api.get(
      "/school-admin/academic-structure/templates",
    );

    return data;
  },

  getAcademicStructure: async (): Promise<{
    classes: ConfigureClass[];
  }> => {
    const { data } = await api.get("/school-admin/academic-structure");

    return data;
  },

  saveAcademicStructure: async (
    payload: SaveAcademicStructureRequest,
  ): Promise<{
    message: string;
    count: number;
  }> => {
    const { data } = await api.post(
      "/school-admin/academic-structure",
      payload,
    );

    return data;
  },

  updateAcademicStructure: async (
    payload: SaveAcademicStructureRequest,
  ): Promise<{
    message: string;
    count: number;
  }> => {
    const { data } = await api.put("/school-admin/academic-structure", payload);

    return data;
  },
};
