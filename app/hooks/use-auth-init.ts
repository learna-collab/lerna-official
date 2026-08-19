"use client";

import { useEffect } from "react";

import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/auth-store";

export function useAuthInit() {
  const startLoading = useAuthStore((s) => s.startLoading);
  const finishLoading = useAuthStore((s) => s.finishLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      startLoading();

      try {
        const refresh = await AuthService.refresh();

        if (!mounted) return;

        setAccessToken(refresh.access_token);

        const user = await AuthService.me(refresh.access_token);

        if (!mounted) return;

        setUser(user);
      } catch (error) {
        if (!mounted) return;

        setUser(null);
        setAccessToken(null);
      } finally {
        if (!mounted) return;

        finishLoading();
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, []);
}
