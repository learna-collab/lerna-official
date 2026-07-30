"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface LessonFiltersProps {
  weekNumber: string;
  onWeekNumberChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}
export function LessonFilters({
  weekNumber,
  onWeekNumberChange,
  onApply,
  onReset,
}: LessonFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      {" "}
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        {" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="weekNumber">Week Number</Label>{" "}
          <Input
            id="weekNumber"
            type="number"
            min={1}
            placeholder="e.g. 6"
            value={weekNumber}
            onChange={(e) => onWeekNumberChange(e.target.value)}
          />{" "}
        </div>{" "}
        <div className="flex items-end gap-2">
          {" "}
          <Button onClick={onApply}>Apply</Button>{" "}
          <Button variant="outline" onClick={onReset}>
            {" "}
            Reset{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
