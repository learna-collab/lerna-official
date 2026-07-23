"use client";

import { CheckCircle2, FileEdit, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface ExamStatusBadgeProps {
  published: boolean;

  startsAt?: string | Date;

  endsAt?: string | Date;

  className?: string;
}

export default function ExamStatusBadge({
  published,
  startsAt,
  endsAt,
  className,
}: ExamStatusBadgeProps) {
  const now = new Date();

  let status: "draft" | "scheduled" | "live" | "ended";

  if (!published) {
    status = "draft";
  } else if (startsAt && now < new Date(startsAt)) {
    status = "scheduled";
  } else if (endsAt && now > new Date(endsAt)) {
    status = "ended";
  } else {
    status = "live";
  }

  switch (status) {
    case "draft":
      return (
        <Badge variant="secondary" className={className}>
          <FileEdit className="mr-1 h-3.5 w-3.5" />
          Draft
        </Badge>
      );

    case "scheduled":
      return (
        <Badge variant="outline" className={className}>
          <Clock3 className="mr-1 h-3.5 w-3.5" />
          Scheduled
        </Badge>
      );

    case "live":
      return (
        <Badge className={className}>
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Published
        </Badge>
      );

    case "ended":
      return (
        <Badge variant="destructive" className={className}>
          Ended
        </Badge>
      );

    default:
      return null;
  }
}
