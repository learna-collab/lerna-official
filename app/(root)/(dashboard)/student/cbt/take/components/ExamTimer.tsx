"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Clock3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ExamTimerProps {
  remainingSeconds: number;
  durationMinutes: number;
  onTimeUp?: () => void;
}

export default function ExamTimer({
  remainingSeconds: initialRemainingSeconds,
  durationMinutes,
  onTimeUp,
}: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialRemainingSeconds,
  );

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        onTimeUp?.();
      }

      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onTimeUp]);

  const totalSeconds = durationMinutes * 60;

  const percentage = useMemo(() => {
    if (totalSeconds === 0) return 0;

    return (remainingSeconds / totalSeconds) * 100;
  }, [remainingSeconds, totalSeconds]);

  const hours = Math.floor(remainingSeconds / 3600);

  const minutes = Math.floor((remainingSeconds % 3600) / 60);

  const seconds = remainingSeconds % 60;

  const formattedTime =
    hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

  const isCritical = remainingSeconds <= 300;

  const isWarning = remainingSeconds <= 900;

  return (
    <Card
      className={
        isCritical ? "border-red-500" : isWarning ? "border-amber-500" : ""
      }
    >
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock3
              className={`h-5 w-5 ${
                isCritical
                  ? "text-red-600"
                  : isWarning
                    ? "text-amber-600"
                    : "text-primary"
              }`}
            />

            <span className="font-medium">Time Remaining</span>
          </div>

          <span
            className={`font-mono text-2xl font-bold ${
              isCritical ? "text-red-600" : isWarning ? "text-amber-600" : ""
            }`}
          >
            {formattedTime}
          </span>
        </div>

        <Progress value={percentage} />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 min</span>
          <span>{durationMinutes} min</span>
        </div>

        {isCritical && (
          <p className="text-center text-sm font-medium text-red-600">
            Less than 5 minutes remaining.
          </p>
        )}

        {!isCritical && isWarning && (
          <p className="text-center text-sm font-medium text-amber-600">
            Less than 15 minutes remaining.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
