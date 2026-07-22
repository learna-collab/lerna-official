"use client";

import { useCallback, useState } from "react";

import { Exam } from "@/app/types/cbt";

export function useExamDialogs() {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [publishOpen, setPublishOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const openPublishDialog = useCallback((exam: Exam) => {
    setSelectedExam(exam);
    setPublishOpen(true);
  }, []);

  const openDeleteDialog = useCallback((exam: Exam) => {
    setSelectedExam(exam);
    setDeleteOpen(true);
  }, []);

  const closePublishDialog = useCallback(() => {
    setPublishOpen(false);

    // wait until dialog animation completes
    setTimeout(() => setSelectedExam(null), 150);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteOpen(false);

    setTimeout(() => setSelectedExam(null), 150);
  }, []);

  const closeAllDialogs = useCallback(() => {
    setPublishOpen(false);
    setDeleteOpen(false);

    setTimeout(() => setSelectedExam(null), 150);
  }, []);

  return {
    selectedExam,

    publishOpen,
    deleteOpen,

    setPublishOpen,
    setDeleteOpen,

    openPublishDialog,
    openDeleteDialog,

    closePublishDialog,
    closeDeleteDialog,
    closeAllDialogs,
  };
}
