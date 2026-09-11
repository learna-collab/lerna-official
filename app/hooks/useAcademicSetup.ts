/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  AcademicTemplateResponse,
  SchoolAcademicSetup,
  SchoolClass,
  ConfigureAcademicSetupRequest,
  ConfigureClassRequest,
  ConfigureSubjectRequest,
  ClassLevel,
  TemplateClassLevel,
} from "@/app/services/academicSetup.service";

import {
  AcademicDialogType,
  ClassUI,
  DialogState,
  SubjectUI,
} from "../(root)/(dashboard)/school-admin/academic-structure/components/types";

/* ===========================================================
 * INITIAL DIALOG STATE
 * =========================================================== */

const initialDialog: DialogState = {
  type: null,
};

/* ===========================================================
 * LEVEL NORMALIZATION
 * ===========================================================
 *
 * Existing seeded database records may contain:
 *
 * JSS1 -> SECONDARY
 * JSS2 -> SECONDARY
 * JSS3 -> SECONDARY
 * SS1  -> SECONDARY
 * SS2  -> SECONDARY
 * SS3  -> SECONDARY
 *
 * The backend does NOT accept SECONDARY.
 *
 * Therefore:
 *
 * JSS1-JSS3 -> JUNIOR_SECONDARY
 * SS1-SS3   -> SENIOR_SECONDARY
 *
 * This normalization happens BEFORE the data reaches
 * the configuration payload.
 * =========================================================== */

function normalizeClassLevel(
  level: TemplateClassLevel | string,
  className: string,
): ClassLevel {
  const normalizedLevel = level.trim().toUpperCase();

  /*
   * Legacy secondary value.
   */
  if (normalizedLevel === "SECONDARY") {
    const normalizedName = className.trim().toUpperCase();

    if (/^JSS[1-3]$/.test(normalizedName)) {
      return "JUNIOR_SECONDARY";
    }

    if (/^SS[1-3]$/.test(normalizedName)) {
      return "SENIOR_SECONDARY";
    }

    throw new Error(
      `Unable to determine the secondary level for class "${className}".`,
    );
  }

  /*
   * Already a valid backend level.
   */
  if (
    normalizedLevel === "PRE_NURSERY" ||
    normalizedLevel === "NURSERY" ||
    normalizedLevel === "PRIMARY" ||
    normalizedLevel === "JUNIOR_SECONDARY" ||
    normalizedLevel === "SENIOR_SECONDARY"
  ) {
    return normalizedLevel;
  }

  throw new Error(
    `Invalid academic level "${level}" for class "${className}".`,
  );
}

/* ===========================================================
 * HOOK
 * =========================================================== */

export function useAcademicSetup() {
  const [templates, setTemplates] = useState<AcademicTemplateResponse[]>([]);

  const [setup, setSetup] = useState<SchoolAcademicSetup | null>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();

  const [draftClasses, setDraftClasses] = useState<ClassUI[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialog, setDialog] = useState<DialogState>(initialDialog);

  /* ===========================================================
   * LOAD DATA
   * =========================================================== */

  const loadTemplates = useCallback(async () => {
    const data = await AcademicSetupService.getTemplates();

    setTemplates(data);
  }, []);

  const loadSetup = useCallback(async () => {
    const data = await AcademicSetupService.getSchoolSetup();

    setSetup(data);

    if (data.configured) {
      setDraftClasses(normalizeClasses(data.classes));
    } else {
      setDraftClasses([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadSetup();
  }, [loadSetup]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        await Promise.all([loadTemplates(), loadSetup()]);
      } catch (error: any) {
        console.error(error);

        toast.error(
          error?.response?.data?.detail ?? "Unable to load academic setup.",
        );
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, [loadSetup, loadTemplates]);

  /* ===========================================================
   * TEMPLATE SELECTION
   * =========================================================== */

  function selectTemplate(template: AcademicTemplateResponse) {
    setSelectedTemplateId(template.id);

    try {
      const classes: ClassUI[] = template.classes.map((cls) => ({
        id: cls.id,

        name: cls.name,

        /*
         * IMPORTANT:
         *
         * Legacy SECONDARY is converted immediately.
         *
         * So draftClasses NEVER contains SECONDARY.
         */
        level: normalizeClassLevel(cls.level, cls.name),

        sort_order: cls.sort_order,

        is_custom: false,

        subjects: cls.subjects.map((subject) => ({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          enabled: true,
          is_custom: false,
        })),
      }));

      setDraftClasses(classes);
    } catch (error: any) {
      console.error("Failed to normalize academic template:", error);

      toast.error(
        error?.message ?? "Unable to load the selected academic template.",
      );

      setDraftClasses([]);
    }
  }

  /* ===========================================================
   * SAVE CONFIGURATION
   * =========================================================== */

  function buildPayload(): ConfigureAcademicSetupRequest | null {
    if (!selectedTemplateId) {
      return null;
    }

    const classes: ConfigureClassRequest[] = draftClasses.map((cls) => ({
      template_class_id: cls.is_custom ? null : cls.id,

      name: cls.name,

      /*
       * draftClasses are already normalized.
       *
       * We normalize again here as a safety measure so
       * SECONDARY can NEVER reach the backend.
       */
      level: normalizeClassLevel(cls.level, cls.name),

      sort_order: cls.sort_order,

      enabled: true,

      is_custom: cls.is_custom,

      subjects: cls.subjects.map(
        (subject): ConfigureSubjectRequest => ({
          template_subject_id: subject.is_custom ? null : subject.id,

          name: subject.name,

          code: subject.code,

          enabled: subject.enabled,

          is_custom: subject.is_custom,
        }),
      ),
    }));

    return {
      academic_template_id: selectedTemplateId,
      classes,
    };
  }

  async function saveSetup() {
    let payload: ConfigureAcademicSetupRequest | null;

    try {
      payload = buildPayload();
    } catch (error: any) {
      console.error("Failed to build academic setup payload:", error);

      toast.error(error?.message ?? "Unable to determine the academic level.");

      return;
    }

    if (!payload) {
      toast.error("Select an academic template first.");

      return;
    }

    if (!payload.classes.length) {
      toast.error("The selected academic template has no classes.");

      return;
    }

    if (setup?.configured) {
      toast.error("Academic setup has already been configured.");

      return;
    }

    try {
      setSaving(true);

      /*
       * At this point every class level is guaranteed to be
       * one of:
       *
       * PRE_NURSERY
       * NURSERY
       * PRIMARY
       * JUNIOR_SECONDARY
       * SENIOR_SECONDARY
       */
      console.log("Academic setup payload:", JSON.stringify(payload, null, 2));

      await AcademicSetupService.configure(payload);

      toast.success("Academic setup completed.");

      await refresh();
    } catch (error: any) {
      console.error(
        "Academic setup configuration failed:",
        error?.response?.data ?? error,
      );

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        const messages = detail
          .map((item: any) => item?.msg ?? "Validation error")
          .join(", ");

        toast.error(messages);
      } else {
        toast.error(detail ?? "Unable to configure setup.");
      }
    } finally {
      setSaving(false);
    }
  }

  /* ===========================================================
   * DIALOG MANAGEMENT
   * =========================================================== */

  function openDialog(
    type: AcademicDialogType,
    payload?: Partial<DialogState>,
  ) {
    setDialog({
      type,
      ...payload,
    });
  }

  function closeDialog() {
    setDialog(initialDialog);
  }

  /* ===========================================================
   * NORMALIZED OUTPUT
   * =========================================================== */

  const classes = useMemo(() => draftClasses, [draftClasses]);

  return {
    templates,
    setup,
    classes,
    loading,
    saving,
    selectedTemplateId,
    selectTemplate,
    saveSetup,
    refresh,
    dialog,
    openDialog,
    closeDialog,

    openAddClass: () => openDialog("ADD_CLASS"),

    openEditClass: (schoolClass: ClassUI) =>
      openDialog("EDIT_CLASS", {
        classId: schoolClass.id,
      }),

    openDeleteClass: (schoolClass: ClassUI) =>
      openDialog("DELETE_CLASS", {
        classId: schoolClass.id,
      }),

    openAddSubject: (schoolClass: ClassUI) =>
      openDialog("ADD_SUBJECT", {
        classId: schoolClass.id,
      }),

    openEditSubject: (schoolClass: ClassUI, subject: SubjectUI) =>
      openDialog("EDIT_SUBJECT", {
        classId: schoolClass.id,
        subjectId: subject.id,
      }),

    openDeleteSubject: (schoolClass: ClassUI, subject: SubjectUI) =>
      openDialog("DELETE_SUBJECT", {
        classId: schoolClass.id,
        subjectId: subject.id,
      }),
  };

  /* ===========================================================
   * HELPERS
   * =========================================================== */

  function normalizeClasses(classes: SchoolClass[]): ClassUI[] {
    return classes.map((cls) => ({
      id: cls.id,

      name: cls.name,

      /*
       * School setup is already expected to contain backend
       * values, but normalize defensively in case an old
       * record still contains SECONDARY.
       */
      level: normalizeClassLevel(cls.level, cls.name),

      sort_order: cls.sort_order,

      is_custom: cls.is_custom,

      subjects: cls.subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        enabled: true,
        is_custom: subject.is_custom,
      })),
    }));
  }
}
