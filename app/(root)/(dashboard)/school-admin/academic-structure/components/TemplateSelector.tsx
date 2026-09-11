"use client";

import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { AcademicTemplateResponse } from "@/app/services/academicSetup.service";

interface TemplateSelectorProps {
  templates: AcademicTemplateResponse[];
  selectedTemplateId?: string;
  configured: boolean;
  onSelect: (template: AcademicTemplateResponse) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  configured,
  onSelect,
}: TemplateSelectorProps) {
  if (configured) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Academic Template</CardTitle>

        <p className="text-sm text-muted-foreground">
          Choose the academic structure that matches your school.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => {
            const active = template.id === selectedTemplateId;

            const subjectIds = new Set(
              template.classes.flatMap((cls) =>
                cls.subjects.map((subject) => subject.id),
              ),
            );

            return (
              <Card
                key={template.id}
                onClick={() => onSelect(template)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  active
                    ? "border-2 border-primary shadow-md"
                    : "hover:border-primary"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>

                      {template.description && (
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      )}
                    </div>

                    {active && (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />

                    <span className="font-medium">
                      {template.classes.length} Classes
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {template.classes.slice(0, 6).map((cls) => (
                      <Badge key={cls.id} variant="secondary">
                        {cls.name}
                      </Badge>
                    ))}

                    {template.classes.length > 6 && (
                      <Badge variant="outline">
                        +{template.classes.length - 6} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {subjectIds.size} Subjects
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
