"use client";

import { RotateCcw, Search } from "lucide-react";

import type { ALFSessionStatus } from "@/app/services/alf.service";

import type { TeacherItem } from "@/app/services/school-admin.service";

interface ClassItem {
  id: string;
  name: string;
}

interface ALFFiltersProps {
  classes: ClassItem[];
  teachers: TeacherItem[];

  search: string;
  status: ALFSessionStatus | "ALL";
  classId: string;
  teacherId: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: ALFSessionStatus | "ALL") => void;
  onClassChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onReset: () => void;
}

export function ALFFilters({
  classes,
  teachers,
  search,
  status,
  classId,
  teacherId,
  onSearchChange,
  onStatusChange,
  onClassChange,
  onTeacherChange,
  onReset,
}: ALFFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        {/* Search */}

        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm font-medium">Search</label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search teacher, lesson or subject..."
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Status */}

        <div className="w-full xl:w-44">
          <label className="mb-2 block text-sm font-medium">Status</label>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ALFSessionStatus | "ALL")
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All statuses</option>
            <option value="STARTED">Started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ABANDONED">Abandoned</option>
          </select>
        </div>

        {/* Class */}

        <div className="w-full xl:w-48">
          <label className="mb-2 block text-sm font-medium">Class</label>

          <select
            value={classId}
            onChange={(event) => onClassChange(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All classes</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </div>

        {/* Teacher */}

        <div className="w-full xl:w-52">
          <label className="mb-2 block text-sm font-medium">Teacher</label>

          <select
            value={teacherId}
            onChange={(event) => onTeacherChange(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All teachers</option>

            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {`${teacher.first_name} ${teacher.last_name}`.trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
