/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Store } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { useAuthStore } from "@/app/store/auth-store";

export default function VendorLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setUser, setAccessToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = searchParams.get("next") || "/vendor/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/vendor/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      if (!data?.user) {
        throw new Error("Invalid vendor login response.");
      }

      if (data.user.role !== "VENDOR") {
        setError("This account is not registered as a marketplace vendor.");
        return;
      }

      setAccessToken(data.access_token ?? null);

      setUser(data.user);

      toast.success("Welcome back!");

      router.replace(next);
    } catch (err: any) {
      console.error("Vendor login failed:", err);

      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item: any) => item?.msg ?? "Invalid input").join(", "),
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Store className="h-5 w-5" />
              </div>

              <span className="text-xl font-bold">LERNA Marketplace</span>
            </Link>
          </div>

          <div className="max-w-lg">
            <p className="text-sm font-medium opacity-80">Vendor portal</p>

            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Manage your store. Grow your business.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 opacity-80">
              Sign in to manage your marketplace store, listings, products,
              services, and digital offerings.
            </p>
          </div>

          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} LERNA
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 lg:hidden">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Store className="h-5 w-5" />
                </div>

                <span className="text-xl font-bold">LERNA Marketplace</span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-sm font-medium text-primary">Vendor sign in</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-muted-foreground">
                Sign in to manage your marketplace store.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to vendor portal
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have a vendor account?{" "}
              <Link
                href="/vendor/register"
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/marketplace"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
