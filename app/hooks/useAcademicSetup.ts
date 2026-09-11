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

* LEGACY LEVEL NORMALIZATION
*
* Existing seeded templates may contain:
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
* Therefore, before configuration is submitted:
*
* JSS1-JSS3 -> JUNIOR_SECONDARY
* SS1-SS3   -> SENIOR_SECONDARY
*
* Existing template IDs are preserved.
* =========================================================== */

function normalizeBackendLevel(
  level: ClassLevel,
  className: string,
): Exclude<ClassLevel, "SECONDARY"> {
  if (level !== "SECONDARY") {
    return level;
  }

  if (/^JSS[1-3]$/i.test(className.trim())) {
    return "JUNIOR_SECONDARY";
  }

  if (/^SS[1-3]$/i.test(className.trim())) {
    return "SENIOR_SECONDARY";
  }

  throw new Error(
    `Unable to determine secondary level for class "${className}".`,
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

    const classes: ClassUI[] = template.classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
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
       * IMPORTANT:
       * Convert legacy SECONDARY into the backend's
       * actual JUNIOR/SENIOR_SECONDARY enum.
       */
      level: normalizeBackendLevel(cls.level, cls.name),

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

      await AcademicSetupService.configure(payload);

      toast.success("Academic setup completed.");

      await refresh();
    } catch (error: any) {
      console.log(error?.response?.data);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(
          detail.map((item: any) => item?.msg ?? "Validation error").join(", "),
        );
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
      level: cls.level,
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
