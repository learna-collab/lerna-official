"use client";

import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatLevel } from "@/app/services/academicSetup.service";

import { SubjectCard } from "./SubjectCard";
import { ClassUI, SubjectUI } from "./types";

export type SubjectCardItem = SubjectUI;
export type AcademicClass = ClassUI;

interface ClassAccordionProps {
  classes: AcademicClass[];
  saving?: boolean;

  onEditClass: (schoolClass: AcademicClass) => void;
  onDeleteClass: (schoolClass: AcademicClass) => void;
  onAddSubject: (schoolClass: AcademicClass) => void;

  onEditSubject: (schoolClass: AcademicClass, subject: SubjectCardItem) => void;

  onDeleteSubject: (
    schoolClass: AcademicClass,
    subject: SubjectCardItem,
  ) => void;
}

export function ClassAccordion({
  classes,
  saving,
  onEditClass,
  onDeleteClass,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}: ClassAccordionProps) {
  if (!classes.length) return null;

  return (
    <Accordion type="multiple" className="space-y-4">
      {classes.map((schoolClass) => (
        <AccordionItem
          key={schoolClass.id}
          value={schoolClass.id}
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex items-center">
            {/* ===================================================
                ACCORDION TRIGGER
            =================================================== */}

            <AccordionTrigger className="min-w-0 flex-1 px-4 py-5 hover:no-underline sm:px-6">
              <div className="min-w-0 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">
                    {schoolClass.name}
                  </h3>

                  <Badge>{formatLevel(schoolClass.level)}</Badge>

                  {schoolClass.is_custom && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />

                  <span>
                    {schoolClass.subjects.length} Subject
                    {schoolClass.subjects.length !== 1 && "s"}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            {/* ===================================================
                ACTION BUTTONS

                IMPORTANT:
                These are OUTSIDE AccordionTrigger because
                AccordionTrigger renders a <button>.
            =================================================== */}

            <div
              className="flex shrink-0 items-center gap-2 px-4 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Desktop Add Subject */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving}
                onClick={() => onAddSubject(schoolClass)}
                className="hidden sm:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>

              {/* Mobile Add Subject */}
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={saving}
                onClick={() => onAddSubject(schoolClass)}
                className="sm:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* Edit */}
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={saving}
                onClick={() => onEditClass(schoolClass)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              {/* Delete */}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                disabled={saving}
                onClick={() => onDeleteClass(schoolClass)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <AccordionContent className="px-4 pb-5 sm:px-6">
            {schoolClass.subjects.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                No subjects have been added to this class.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {schoolClass.subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    saving={saving}
                    onEdit={() => onEditSubject(schoolClass, subject)}
                    onDelete={() => onDeleteSubject(schoolClass, subject)}
                  />
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
