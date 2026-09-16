/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Calendar, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAcademicSetup } from "@/app/hooks/useAcademicSetup";
import { toast } from "sonner";

import { AcademicSummary } from "./components/AcademicSummary";
import { TemplateSelector } from "./components/TemplateSelector";
import { ClassAccordion } from "./components/ClassAccordion";
import { AddClassDialog } from "./components/AddClassDialog";
import { EditClassDialog } from "./components/EditClassDialog";
import { DeleteSubjectDialog } from "./components/DeleteSubjectDialog";
import { EditSubjectDialog } from "./components/EditSubjectDialog";
import { AddSubjectDialog } from "./components/AddSubjectDialog";
import { DeleteClassDialog } from "./components/DeleteClassDialog";

import {
  AcademicPeriodOption,
  AcademicSetupService,
} from "@/app/services/academicSetup.service";

export default function AcademicSetupPage() {
  const academic = useAcademicSetup();

  /* =========================================================
     ACADEMIC PERIOD STATE
  ========================================================= */

  const [sessions, setSessions] = useState<AcademicPeriodOption[]>([]);
  const [terms, setTerms] = useState<AcademicPeriodOption[]>([]);

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");

  const [initialSessionId, setInitialSessionId] = useState("");
  const [initialTermId, setInitialTermId] = useState("");

  const [resetting, setResetting] = useState(false);
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [periodSaved, setPeriodSaved] = useState(false);

  /* =========================================================
     LOAD ACADEMIC PERIOD
  ========================================================= */

  useEffect(() => {
    async function loadAcademicPeriod() {
      try {
        const [options, current] = await Promise.all([
          AcademicSetupService.getAcademicPeriodOptions(),
          AcademicSetupService.getCurrentAcademicPeriod(),
        ]);

        setSessions(options.sessions);
        setTerms(options.terms);

        if (current) {
          setSelectedSessionId(current.session_id);
          setSelectedTermId(current.term_id);

          setInitialSessionId(current.session_id);
          setInitialTermId(current.term_id);

          setPeriodSaved(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load academic period.");
      }
    }

    void loadAcademicPeriod();
  }, []);

  /* =========================================================
     ACADEMIC PERIOD
  ========================================================= */

  const hasPeriodChanged =
    selectedSessionId !== initialSessionId || selectedTermId !== initialTermId;

  async function saveAcademicPeriod() {
    if (!selectedSessionId || !selectedTermId) {
      toast.error("Please select both session and term.");
      return;
    }

    try {
      setSavingPeriod(true);

      await AcademicSetupService.updateCurrentAcademicPeriod({
        session_id: selectedSessionId,
        term_id: selectedTermId,
      });

      setInitialSessionId(selectedSessionId);
      setInitialTermId(selectedTermId);
      setPeriodSaved(true);

      toast.success("Academic period updated successfully.");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ?? "Failed to update academic period.",
      );
    } finally {
      setSavingPeriod(false);
    }
  }

  /* =========================================================
     RESET ACTIVE ACADEMIC SETUP
     
     IMPORTANT:
     This does NOT delete historical classes/subjects.
     It only removes current ClassSubject mappings.
  ========================================================= */

  async function resetAcademicSetup() {
    const confirmed = window.confirm(
      "This will clear the school's current academic configuration. " +
        "Classes and subjects will be preserved so that historical " +
        "enrollments and results are not affected. Continue?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setResetting(true);

      await AcademicSetupService.resetSchoolSetup();

      toast.success("Current academic configuration has been cleared.");

      await academic.refresh();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ??
          "Failed to clear academic configuration.",
      );
    } finally {
      setResetting(false);
    }
  }

  /* =========================================================
     ACADEMIC SETUP DATA
  ========================================================= */

  const configured = academic.setup?.configured ?? false;

  const classCount = academic.classes.length;

  const subjectCount = academic.classes.reduce(
    (total, schoolClass) => total + schoolClass.subjects.length,
    0,
  );

  const selectedTemplate = academic.templates.find(
    (template) => template.id === academic.selectedTemplateId,
  );

  const selectedClass = academic.dialog.classId
    ? academic.classes.find(
        (schoolClass) => schoolClass.id === academic.dialog.classId,
      )
    : null;

  const selectedSubject =
    selectedClass && academic.dialog.subjectId
      ? selectedClass.subjects.find(
          (subject) => subject.id === academic.dialog.subjectId,
        )
      : null;

  /* =========================================================
     LOADING
  ========================================================= */

  if (academic.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-6 p-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Academic Setup</h1>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Configure your school&apos;s academic period, classes, and subjects.
            Start by selecting a template below, then review the generated
            classes and subjects before configuring your school.
          </p>
        </div>

        {configured && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="destructive"
              onClick={resetAcademicSetup}
              disabled={resetting || academic.saving}
            >
              {resetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Setup
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={academic.openAddClass}
              disabled={academic.saving || resetting}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </div>
        )}
      </div>

      {/* =====================================================
          ACADEMIC PERIOD
      ===================================================== */}

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-slate-50/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Current Academic Period
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Select the academic session and term currently active in your
                school. This controls attendance, lesson notes, results, and
                reports across the system.
              </p>
            </div>

            {periodSaved ? (
              <div className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Configured
              </div>
            ) : (
              <div className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Not configured
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Current Selection Summary */}

          {periodSaved && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Active Session
                  </span>

                  <span className="font-semibold">
                    {sessions.find(
                      (session) => session.id === selectedSessionId,
                    )?.name ?? "—"}
                  </span>
                </div>

                <div className="h-8 w-px bg-blue-200" />

                <div>
                  <span className="block text-xs text-muted-foreground">
                    Active Term
                  </span>

                  <span className="font-semibold">
                    {terms.find((term) => term.id === selectedTermId)?.name ??
                      "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Selectors */}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Academic Session</Label>

              <Select
                value={selectedSessionId}
                onValueChange={setSelectedSessionId}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>

                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Academic Term</Label>

              <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>

                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Change Notice */}

          {hasPeriodChanged && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              You have unsaved changes. Click{" "}
              <strong>Update Academic Period</strong> to apply the new session
              and term.
            </div>
          )}

          {/* Actions */}

          <div className="flex justify-end border-t pt-4">
            <Button
              size="lg"
              onClick={saveAcademicPeriod}
              disabled={
                savingPeriod ||
                !selectedSessionId ||
                !selectedTermId ||
                (periodSaved && !hasPeriodChanged)
              }
              className="min-w-[220px]"
            >
              {savingPeriod ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {periodSaved
                    ? "Update Academic Period"
                    : "Save Academic Period"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <AcademicSummary
        configured={configured}
        templateName={selectedTemplate?.name ?? null}
        classCount={classCount}
        subjectCount={subjectCount}
      />

      {/* =====================================================
          TEMPLATE PICKER
      ===================================================== */}

      <div className="space-y-4">
        <TemplateSelector
          templates={academic.templates}
          selectedTemplateId={academic.selectedTemplateId}
          configured={configured}
          onSelect={academic.selectTemplate}
        />

        {!configured && (
          <Card className="border-blue-100 bg-blue-50/40">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900">
                  Ready to configure your school?
                </p>

                <p className="text-sm text-blue-800">
                  Review the selected template and generated classes, then click
                  Configure School to create the academic structure for your
                  school.
                </p>
              </div>

              <Button
                onClick={academic.saveSetup}
                disabled={academic.saving || !academic.classes.length}
                size="lg"
                className="min-w-[220px] shrink-0"
              >
                {academic.saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configuring...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Configure School
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* =====================================================
          CLASSES

          We continue showing the template preview while setup
          is not configured.

          Once configured, these are the school's active
          classes returned by the backend.
      ===================================================== */}

      <ClassAccordion
        classes={academic.classes}
        saving={academic.saving || resetting}
        onEditClass={academic.openEditClass}
        onDeleteClass={academic.openDeleteClass}
        onAddSubject={academic.openAddSubject}
        onEditSubject={academic.openEditSubject}
        onDeleteSubject={academic.openDeleteSubject}
      />

      {/* =====================================================
          DIALOGS
      ===================================================== */}

      <AddClassDialog
        open={academic.dialog.type === "ADD_CLASS"}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
        defaultSortOrder={academic.classes.length + 1}
      />

      <EditClassDialog
        open={academic.dialog.type === "EDIT_CLASS"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <DeleteClassDialog
        open={academic.dialog.type === "DELETE_CLASS"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <AddSubjectDialog
        open={academic.dialog.type === "ADD_SUBJECT"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <EditSubjectDialog
        open={academic.dialog.type === "EDIT_SUBJECT"}
        subject={selectedSubject as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <DeleteSubjectDialog
        open={academic.dialog.type === "DELETE_SUBJECT"}
        subject={selectedSubject as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />
    </div>
  );
}
