"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

type Props = {
  children: React.ReactNode;
  redirectTo: string;
};

export function LogoutButton({ children, redirectTo }: Props) {
  const router = useRouter();

  const logout = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      // 🔐 call backend logout (clears refresh cookie)
      await AuthService.logout();

      // 🧠 clear zustand state
      logout();

      // 🚀 redirect
      router.push(redirectTo);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div onClick={handleLogout} className="cursor-pointer">
      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
