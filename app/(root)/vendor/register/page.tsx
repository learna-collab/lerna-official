/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowRight, CheckCircle2, Loader2, Store } from "lucide-react";

import { api } from "@/lib/api";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/vendor/register", {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Vendor registration failed:", err);

      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item: any) => item?.msg ?? "Invalid input").join(", "),
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to create your vendor account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">Account created</h1>

            <p className="mt-4 leading-7 text-muted-foreground">
              Your vendor account has been created successfully. Sign in to
              complete your store profile and start setting up your listings.
            </p>

            <button
              type="button"
              onClick={() => router.push("/vendor/login")}
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue to login
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/marketplace"
              className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              Back to marketplace
            </Link>
          </div>
        </div>
      </main>
    );
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
            <p className="text-sm font-medium opacity-80">Become a vendor</p>

            <h2 className="mt-4 text-5xl font-bold leading-tight">
              Build your store. Reach more customers.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 opacity-80">
              Create your vendor account and bring your products, services, and
              digital offerings to the LERNA Marketplace.
            </p>
          </div>

          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} LERNA
          </p>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <div className="mb-8 lg:hidden">
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
              <p className="text-sm font-medium text-primary">
                Vendor registration
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Create your vendor account
              </h1>

              <p className="mt-3 text-muted-foreground">
                Start with your personal details. You can configure your store
                after signing in.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium">
                    First name
                  </label>

                  <input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    value={form.first_name}
                    onChange={(event) =>
                      updateField("first_name", event.target.value)
                    }
                    placeholder="John"
                    disabled={isLoading}
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium">
                    Last name
                  </label>

                  <input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    value={form.last_name}
                    onChange={(event) =>
                      updateField("last_name", event.target.value)
                    }
                    placeholder="Vendor"
                    disabled={isLoading}
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="At least 8 characters"
                  disabled={isLoading}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-medium"
                >
                  Confirm password
                </label>

                <input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm_password}
                  onChange={(event) =>
                    updateField("confirm_password", event.target.value)
                  }
                  placeholder="Repeat your password"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create vendor account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/vendor/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              By creating an account, you are registering as a LERNA Marketplace
              vendor. Your store must be approved before listings can be
              published publicly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
