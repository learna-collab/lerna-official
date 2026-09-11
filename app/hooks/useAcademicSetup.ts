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
 * LEVEL ORDER
 *
 * This controls how templates/classes appear in the UI.
 * It matches the backend's current levels.
 * =========================================================== */

const LEVEL_ORDER: Record<string, number> = {
  NURSERY: 1,
  PRIMARY: 2,
  SECONDARY: 3,
};

/* ===========================================================
 * SORT CLASSES
 * =========================================================== */

function sortClasses(classes: ClassUI[]): ClassUI[] {
  return [...classes].sort((a, b) => {
    const levelA = LEVEL_ORDER[a.level] ?? 999;
    const levelB = LEVEL_ORDER[b.level] ?? 999;

    if (levelA !== levelB) {
      return levelA - levelB;
    }

    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    return a.name.localeCompare(b.name);
  });
}

/* ===========================================================
 * SORT TEMPLATE CLASSES
 * =========================================================== */

function sortTemplateClasses(classes: AcademicTemplateResponse["classes"]) {
  return [...classes].sort((a, b) => {
    const levelA = LEVEL_ORDER[a.level] ?? 999;
    const levelB = LEVEL_ORDER[b.level] ?? 999;

    if (levelA !== levelB) {
      return levelA - levelB;
    }

    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    return a.name.localeCompare(b.name);
  });
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
   * LOAD TEMPLATES
   * =========================================================== */

  const loadTemplates = useCallback(async () => {
    const data = await AcademicSetupService.getTemplates();

    const sortedTemplates = data.map((template) => ({
      ...template,
      classes: sortTemplateClasses(template.classes).map((schoolClass) => ({
        ...schoolClass,
        subjects: [...schoolClass.subjects].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      })),
    }));

    setTemplates(sortedTemplates);
  }, []);

  /* ===========================================================
   * LOAD EXISTING SCHOOL SETUP
   * =========================================================== */

  const loadSetup = useCallback(async () => {
    const data = await AcademicSetupService.getSchoolSetup();

    setSetup(data);

    if (data.configured) {
      setDraftClasses(normalizeClasses(data.classes));
    } else {
      setDraftClasses([]);
    }
  }, []);

  /* ===========================================================
   * REFRESH
   * =========================================================== */

  const refresh = useCallback(async () => {
    await loadSetup();
  }, [loadSetup]);

  /* ===========================================================
   * INITIAL LOAD
   * =========================================================== */

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setLoading(true);

        const [templateData, setupData] = await Promise.all([
          AcademicSetupService.getTemplates(),
          AcademicSetupService.getSchoolSetup(),
        ]);

        if (!mounted) {
          return;
        }

        const sortedTemplates = templateData.map((template) => ({
          ...template,
          classes: sortTemplateClasses(template.classes).map((schoolClass) => ({
            ...schoolClass,
            subjects: [...schoolClass.subjects].sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
          })),
        }));

        setTemplates(sortedTemplates);
        setSetup(setupData);

        if (setupData.configured) {
          setDraftClasses(normalizeClasses(setupData.classes));
        } else {
          setDraftClasses([]);
        }
      } catch (error: any) {
        console.error("Failed to initialize academic setup:", error);

        toast.error(
          error?.response?.data?.detail ?? "Unable to load academic setup.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void init();

    return () => {
      mounted = false;
    };
  }, []);

  /* ===========================================================
   * TEMPLATE SELECTION
   *
   * IMPORTANT:
   *
   * The selected template's class ID becomes
   * template_class_id.
   *
   * The selected template's subject ID becomes
   * template_subject_id.
   *
   * We do NOT use school IDs here because the school has
   * not been configured yet.
   * =========================================================== */

  const selectTemplate = useCallback((template: AcademicTemplateResponse) => {
    setSelectedTemplateId(template.id);

    const classes: ClassUI[] = sortTemplateClasses(template.classes).map(
      (templateClass) => ({
        /*
         * Before configuration, ClassUI.id is the
         * template class ID.
         *
         * buildPayload() will send this as
         * template_class_id.
         */
        id: templateClass.id,

        name: templateClass.name,

        level: templateClass.level,

        sort_order: templateClass.sort_order,

        is_custom: false,

        subjects: [...templateClass.subjects]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((templateSubject) => ({
            /*
             * Before configuration, SubjectUI.id is
             * the template subject ID.
             *
             * buildPayload() sends this as
             * template_subject_id.
             */
            id: templateSubject.id,

            name: templateSubject.name,

            code: templateSubject.code,

            enabled: true,

            is_custom: false,
          })),
      }),
    );

    setDraftClasses(classes);
  }, []);

  /* ===========================================================
   * BUILD CONFIGURATION PAYLOAD
   * =========================================================== */

  const buildPayload = useCallback((): ConfigureAcademicSetupRequest | null => {
    if (!selectedTemplateId) {
      return null;
    }

    const classes: ConfigureClassRequest[] = draftClasses.map((cls) => ({
      /*
       * Template class:
       * cls.id = template class ID.
       *
       * Custom class:
       * no template ID.
       */
      template_class_id: cls.is_custom ? null : cls.id,

      name: cls.name,

      level: cls.level,

      sort_order: cls.sort_order,

      enabled: true,

      is_custom: cls.is_custom,

      subjects: cls.subjects.map(
        (subject): ConfigureSubjectRequest => ({
          /*
           * Template subject:
           * subject.id = template subject ID.
           *
           * Custom subject:
           * no template ID.
           */
          template_subject_id: subject.is_custom ? null : subject.id,

          name: subject.name,

          code: subject.code ?? null,

          enabled: subject.enabled,

          is_custom: subject.is_custom,
        }),
      ),
    }));

    return {
      academic_template_id: selectedTemplateId,

      classes,
    };
  }, [draftClasses, selectedTemplateId]);

  /* ===========================================================
   * SAVE CONFIGURATION
   * =========================================================== */

  const saveSetup = useCallback(async () => {
    const payload = buildPayload();

    if (!payload) {
      toast.error("Select an academic template first.");
      return;
    }

    if (!payload.classes.length) {
      toast.error("The selected academic template has no classes.");
      return;
    }

    const enabledClasses = payload.classes.filter((cls) => cls.enabled);

    if (!enabledClasses.length) {
      toast.error("Enable at least one class before configuring.");
      return;
    }

    for (const schoolClass of enabledClasses) {
      const enabledSubjects = schoolClass.subjects.filter(
        (subject) => subject.enabled,
      );

      if (!enabledSubjects.length) {
        toast.error(
          `${schoolClass.name} must have at least one enabled subject.`,
        );
        return;
      }
    }

    if (setup?.configured) {
      toast.error("Academic setup has already been configured.");
      return;
    }

    try {
      setSaving(true);

      const response = await AcademicSetupService.configure(payload);

      /*
       * Keep the backend response as the source of
       * truth after configuration.
       */
      setSetup(response.setup);

      setDraftClasses(normalizeClasses(response.setup.classes));

      toast.success("Academic setup completed successfully.");
    } catch (error: any) {
      console.error("Academic setup configuration failed:", error);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(
          detail.map((item: any) => item?.msg ?? "Validation error").join(", "),
        );
      } else {
        toast.error(detail ?? "Unable to configure academic setup.");
      }
    } finally {
      setSaving(false);
    }
  }, [buildPayload, setup]);

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

  const classes = useMemo(() => sortClasses(draftClasses), [draftClasses]);

  /* ===========================================================
   * RETURN
   * =========================================================== */

  return {
    templates,

    setup,

    classes,

    loading,

    saving,

    selectedTemplateId,

    selectTemplate,

    saveSetup,

    buildPayload,

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
}

/* ===========================================================
 * NORMALIZE SCHOOL SETUP
 *
 * After configuration, IDs are SCHOOL IDs.
 * That is correct because the backend has now created
 * Class and Subject records for the school.
 * =========================================================== */

function normalizeClasses(classes: SchoolClass[]): ClassUI[] {
  return sortClasses(
    classes.map((cls) => ({
      id: cls.id,

      name: cls.name,

      level: cls.level,

      sort_order: cls.sort_order,

      is_custom: cls.is_custom,

      subjects: [...cls.subjects]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((subject) => ({
          id: subject.id,

          name: subject.name,

          code: subject.code,

          enabled: true,

          is_custom: subject.is_custom,
        })),
    })),
  );
}
