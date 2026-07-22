"use client";

import { useState } from "react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

interface UseExamActionsProps {
  onSuccess?: () => void | Promise<void>;
}

export function useExamActions({ onSuccess }: UseExamActionsProps = {}) {
  const [publishing, setPublishing] = useState(false);

  const [deleting, setDeleting] = useState(false);

  async function publishExam(examId: string) {
    try {
      setPublishing(true);

      const response = await CBTService.publishExam(examId);

      if (!response.success) {
        toast.error(response.message);

        return false;
      }

      toast.success("Examination published successfully.");

      await onSuccess?.();

      return true;
    } catch {
      toast.error("Unable to publish examination.");

      return false;
    } finally {
      setPublishing(false);
    }
  }

  async function deleteExam(examId: string) {
    try {
      setDeleting(true);

      const response = await CBTService.deleteExam(examId);

      if (!response.success) {
        toast.error(response.message);

        return false;
      }

      toast.success("Examination deleted successfully.");

      await onSuccess?.();

      return true;
    } catch {
      toast.error("Unable to delete examination.");

      return false;
    } finally {
      setDeleting(false);
    }
  }

  return {
    publishing,
    deleting,

    publishExam,
    deleteExam,
  };
}
