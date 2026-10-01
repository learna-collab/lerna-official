/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function AssignSubjectModal({
  classId,
  onSuccess,
}: {
  classId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  async function load() {
    const data = await SchoolAdminService.getSubjects();

    setSubjects(
      Array.isArray(data)
        ? data
        : (data as { subjects?: any[] } | null)?.subjects || [],
    );
  }

  useEffect(() => {
    if (open) void Promise.resolve().then(() => load());
  }, [open]);

  async function assign(subjectId: string) {
    await SchoolAdminService.assignSubjectToClass(classId, subjectId);

    setOpen(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Subject</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {subjects.map((s) => (
            <div key={s.id} className="flex justify-between border p-2 rounded">
              <span>{s.name}</span>

              <Button size="sm" onClick={() => assign(s.id)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
