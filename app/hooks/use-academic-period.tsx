"use client";

import { useEffect, useState } from "react";
import {
  AcademicSetupService,
  SchoolAcademicPeriodResponse,
} from "../services/academicSetup.service";

export function useAcademicPeriod() {
  const [data, setData] = useState<SchoolAcademicPeriodResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAcademicPeriod() {
      try {
        const response = await AcademicSetupService.getCurrentAcademicPeriod();

        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadAcademicPeriod();
  }, []);

  return {
    academicPeriod: data,

    session: data
      ? {
          id: data.session_id,
          name: data.session_name,
        }
      : null,

    term: data
      ? {
          id: data.term_id,
          name: data.term_name,
        }
      : null,

    loading,
  };
}
