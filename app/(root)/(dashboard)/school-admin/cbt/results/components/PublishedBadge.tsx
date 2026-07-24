"use client";

import { CheckCircle2, FileEdit } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PublishedBadgeProps {
  published: boolean;
}

export default function PublishedBadge({ published }: PublishedBadgeProps) {
  return (
    <Badge
      variant={published ? "default" : "secondary"}
      className="flex w-fit items-center gap-1.5"
    >
      {published ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Published
        </>
      ) : (
        <>
          <FileEdit className="h-3.5 w-3.5" />
          Draft
        </>
      )}
    </Badge>
  );
}
