"use client";

import { CheckCircle2, Loader2, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  /**
   * Saving request currently in progress.
   */
  saving: boolean;

  /**
   * Last successful save timestamp.
   */
  lastSaved?: Date | null;

  /**
   * Optional error message if autosave failed.
   */
  error?: string | null;

  className?: string;
}

export default function AutoSaveIndicator({
  saving,
  lastSaved,
  error,
  className,
}: AutoSaveIndicatorProps) {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm",
        className,
      )}
    >
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />

          <span className="text-muted-foreground">Saving answer...</span>
        </>
      ) : error ? (
        <>
          <WifiOff className="h-4 w-4 text-destructive" />

          <span className="text-destructive">{error}</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />

          <span className="text-muted-foreground">
            {lastSaved
              ? `Saved at ${formatTime(lastSaved)}`
              : "All changes saved"}
          </span>
        </>
      )}
    </div>
  );
}
