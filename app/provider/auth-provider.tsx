"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { setupAuthInterceptor } from "@/lib/auth-interceptors";
import { useAuthInit } from "../hooks/use-auth-init";
import { useAuthStore } from "../store/auth-store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // =========================================================
  // INITIALIZE AXIOS INTERCEPTORS
  // =========================================================

  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  // =========================================================
  // INITIALIZE AUTH
  // =========================================================

  useAuthInit();

  // =========================================================
  // WAIT FOR AUTH INITIALIZATION
  // =========================================================

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
