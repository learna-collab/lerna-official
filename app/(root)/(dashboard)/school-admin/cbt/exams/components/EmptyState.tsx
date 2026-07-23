"use client";

import { ReactNode } from "react";

import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;

  title: string;

  description?: string;

  action?: ReactNode;

  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-8 py-16 text-center ${
        className ?? ""
      }`}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon ?? <Inbox className="h-8 w-8 text-primary" />}
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
