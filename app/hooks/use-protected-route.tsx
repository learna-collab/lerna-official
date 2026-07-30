"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth-store";

export function useProtectedRoute(role?: string) {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!hydrated || isLoading) return;

    if (!user) {
      router.replace("/schoolportal");
      return;
    }

    if (role && user.role !== role) {
      router.replace("/schoolportal");
      return;
    }
  }, [hydrated, isLoading, user, role, router]);

  return { hydrated, user };
}
