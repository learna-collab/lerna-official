"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/store/auth-store";

export default function VendorEntryPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!hydrated || isLoading) {
      return;
    }

    if (user?.role === "VENDOR") {
      router.replace("/vendor/dashboard");
      return;
    }

    router.replace("/vendor/login");
  }, [hydrated, isLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  );
}
