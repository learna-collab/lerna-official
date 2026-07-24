"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PassRateBadgeProps {
  passRate: number;
}

export default function PassRateBadge({ passRate }: PassRateBadgeProps) {
  const getVariant = () => {
    if (passRate >= 70) {
      return "default";
    }

    if (passRate >= 50) {
      return "secondary";
    }

    return "destructive";
  };

  const getIcon = () => {
    if (passRate >= 50) {
      return <TrendingUp className="h-3.5 w-3.5" />;
    }

    return <TrendingDown className="h-3.5 w-3.5" />;
  };

  const getLabel = () => {
    if (passRate >= 70) {
      return "Excellent";
    }

    if (passRate >= 50) {
      return "Average";
    }

    return "Low";
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge variant={getVariant()} className="flex w-fit items-center gap-1.5">
        {getIcon()}
        {passRate.toFixed(1)}%
      </Badge>

      <span className="text-xs text-muted-foreground">{getLabel()}</span>
    </div>
  );
}
