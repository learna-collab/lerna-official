"use client";

import { User2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentAvatarProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    avatar: "h-8 w-8",
    text: "text-xs",
  },
  md: {
    avatar: "h-10 w-10",
    text: "text-sm",
  },
  lg: {
    avatar: "h-12 w-12",
    text: "text-base",
  },
};

export default function StudentAvatar({
  firstName,
  lastName,
  size = "md",
}: StudentAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
    .trim()
    .toUpperCase();

  return (
    <Avatar className={sizes[size].avatar}>
      <AvatarFallback
        className={`bg-primary/10 font-semibold text-primary ${sizes[size].text}`}
      >
        {initials.length > 0 ? initials : <User2 className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
