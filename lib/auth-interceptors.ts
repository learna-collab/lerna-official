import { api } from "./api";
import { useAuthStore } from "@/app/store/auth-store";

let interceptorInitialized = false;

/**
 * Shared refresh promise.
 *
 * If several requests receive 401 at the same time,
 * they all wait for the same refresh request instead
 * of each trying to refresh independently.
 */
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((response) => {
        const newAccessToken = response.data.access_token;

        useAuthStore.getState().setAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function setupAuthInterceptor() {
  // Prevent duplicate interceptors.
  if (interceptorInitialized) {
    return;
  }

  interceptorInitialized = true;

  // =========================================================
  // REQUEST INTERCEPTOR
  // =========================================================

  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // =========================================================
  // RESPONSE INTERCEPTOR
  // =========================================================

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // No request config available
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Never refresh the refresh endpoint itself
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // Only handle 401
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Prevent infinite retry loops
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    },
  );
}
