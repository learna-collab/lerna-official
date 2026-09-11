/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { FormEvent, useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";

import { useAuthStore } from "@/app/store/auth-store";
import { MarketplaceVendorService } from "@/app/services/vendor.service";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type VendorType = "INDIVIDUAL" | "BUSINESS";

type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface Vendor {
  id: string;
  user_id: string;
  vendor_type: VendorType;
  store_name: string;
  business_name?: string | null;
  slug: string;
  description?: string | null;
  phone?: string | null;
  public_email?: string | null;
  address?: string | null;
  logo_url?: string | null;
  status: VendorStatus;
  is_active: boolean;
}

interface FormState {
  vendor_type: VendorType;
  store_name: string;
  business_name: string;
  description: string;
  phone: string;
  public_email: string;
  address: string;
  logo_url: string;
}

const emptyForm: FormState = {
  vendor_type: "INDIVIDUAL",
  store_name: "",
  business_name: "",
  description: "",
  phone: "",
  public_email: "",
  address: "",
  logo_url: "",
};

const statusStyles: Record<VendorStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  SUSPENDED: "border-red-200 bg-red-50 text-red-700",
};

export default function VendorProfilePage() {
  const { user, hydrated, isLoading: authLoading } = useAuthStore();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Used to show the dashboard CTA immediately after
  // the vendor creates their profile.
  const [profileCreated, setProfileCreated] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);
      setNotFound(false);

      const response = await MarketplaceVendorService.getProfile();

      setVendor(response);
      setProfileCreated(false);

      setForm({
        vendor_type: response.vendor_type || "INDIVIDUAL",
        store_name: response.store_name || "",
        business_name: response.business_name || "",
        description: response.description || "",
        phone: response.phone || "",
        public_email: response.public_email || "",
        address: response.address || "",
        logo_url: response.logo_url || "",
      });
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setVendor(null);
        setNotFound(true);

        if (user?.email) {
          setForm((current) => ({
            ...current,
            public_email: user.email,
          }));
        }
      } else {
        toast.error(
          error?.response?.data?.detail || "Unable to load your store profile.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hydrated || authLoading) {
      return;
    }

    if (!user || user.role !== "VENDOR") {
      return;
    }

    Promise.resolve().then(() => loadProfile());
  }, [hydrated, authLoading, user]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.store_name.trim()) {
      toast.error("Store name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        vendor_type: form.vendor_type,
        store_name: form.store_name.trim(),
        business_name: form.business_name.trim() || undefined,
        description: form.description.trim() || undefined,
        phone: form.phone.trim() || undefined,
        public_email: form.public_email.trim() || undefined,
        address: form.address.trim() || undefined,
        logo_url: form.logo_url.trim() || undefined,
      };

      let response: Vendor;

      if (vendor) {
        response = await MarketplaceVendorService.updateProfile(payload);

        // Updating an existing profile does not trigger
        // the "profile created" dashboard message.
        setProfileCreated(false);
      } else {
        response = await MarketplaceVendorService.createProfile(
          payload as {
            vendor_type: "INDIVIDUAL" | "BUSINESS";
            store_name: string;
            business_name?: string;
            description?: string;
            phone?: string;
            public_email?: string;
            address?: string;
            logo_url?: string;
          },
        );

        // Profile has just been created.
        setProfileCreated(true);
      }

      setVendor(response);
      setNotFound(false);

      setForm({
        vendor_type: response.vendor_type || "INDIVIDUAL",
        store_name: response.store_name || "",
        business_name: response.business_name || "",
        description: response.description || "",
        phone: response.phone || "",
        public_email: response.public_email || "",
        address: response.address || "",
        logo_url: response.logo_url || "",
      });

      toast.success(
        vendor
          ? "Store profile updated successfully."
          : "Store profile created successfully.",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Unable to save your store profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated || authLoading || loading) {
    return <ProfileSkeleton />;
  }

  if (!user || user.role !== "VENDOR") {
    return null;
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-3 mb-4">
            <Link href="/vendor/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Vendor account</p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Store profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Set up the information customers will see when they visit your
                marketplace store.
              </p>
            </div>

            {vendor && (
              <Badge variant="outline" className={statusStyles[vendor.status]}>
                {vendor.status === "APPROVED" && (
                  <BadgeCheck className="mr-1.5 h-3.5 w-3.5" />
                )}

                {vendor.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Profile created CTA */}
        {profileCreated && vendor && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Your store profile is ready</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  You can now continue to your vendor dashboard and start
                  managing your marketplace store.
                </p>
              </div>

              <Button asChild className="shrink-0">
                <Link href="/vendor/dashboard">Go to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Approval message */}
        {vendor?.status === "APPROVED" && (
          <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
            <CardContent className="flex items-start gap-3 p-5">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="font-medium text-emerald-900">
                  Your vendor account is approved
                </p>

                <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                  Your store can publish marketplace listings as long as the
                  vendor account remains active.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {vendor?.status === "PENDING" && (
          <Card className="mb-6 border-amber-200 bg-amber-50/50">
            <CardContent className="p-5">
              <p className="font-medium text-amber-900">
                Your store is awaiting approval
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800/80">
                You can complete and update your store profile while the
                marketplace administrator reviews your vendor account.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main information */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Store information</CardTitle>

                  <CardDescription>
                    Basic information about your marketplace store.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Vendor type */}
                  <div className="space-y-3">
                    <Label>Vendor type</Label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => updateField("vendor_type", "INDIVIDUAL")}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                          form.vendor_type === "INDIVIDUAL"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-medium">Individual</p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Sell as an individual vendor.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("vendor_type", "BUSINESS")}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                          form.vendor_type === "BUSINESS"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-medium">Business</p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Sell on behalf of a business.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Store name */}
                  <div className="space-y-2">
                    <Label htmlFor="store_name">Store name</Label>

                    <div className="relative">
                      <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="store_name"
                        value={form.store_name}
                        onChange={(event) =>
                          updateField("store_name", event.target.value)
                        }
                        placeholder="e.g. Wilson Designs"
                        className="pl-9"
                        maxLength={200}
                        required
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      This is the name customers will see on the marketplace.
                    </p>
                  </div>

                  {/* Business name */}
                  {form.vendor_type === "BUSINESS" && (
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business name</Label>

                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="business_name"
                          value={form.business_name}
                          onChange={(event) =>
                            updateField("business_name", event.target.value)
                          }
                          placeholder="Registered business name"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Store description</Label>

                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Tell customers what your store offers..."
                      className="min-h-32 resize-none"
                      maxLength={2000}
                    />

                    <p className="text-xs text-muted-foreground">
                      A short description helps customers understand your store.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact information</CardTitle>

                  <CardDescription>
                    Contact details customers can use to reach your store.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>

                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(event) =>
                            updateField("phone", event.target.value)
                          }
                          placeholder="+234..."
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="public_email">Public email</Label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="public_email"
                          type="email"
                          value={form.public_email}
                          onChange={(event) =>
                            updateField("public_email", event.target.value)
                          }
                          placeholder="store@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Store address</Label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                      <Textarea
                        id="address"
                        value={form.address}
                        onChange={(event) =>
                          updateField("address", event.target.value)
                        }
                        placeholder="Store or business address"
                        className="min-h-24 resize-none pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store logo</CardTitle>

                  <CardDescription>
                    Add the URL of your store logo.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    {form.logo_url ? (
                      <img
                        src={form.logo_url}
                        alt="Store logo preview"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Store className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>

                    <Input
                      id="logo_url"
                      type="url"
                      value={form.logo_url}
                      onChange={(event) =>
                        updateField("logo_url", event.target.value)
                      }
                      placeholder="https://..."
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      You can use a Cloudinary image URL or another publicly
                      accessible image URL.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {vendor && (
                <Card>
                  <CardHeader>
                    <CardTitle>Store status</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Approval
                      </span>

                      <Badge
                        variant="outline"
                        className={statusStyles[vendor.status]}
                      >
                        {vendor.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account
                      </span>

                      <Badge
                        variant={vendor.is_active ? "default" : "secondary"}
                      >
                        {vendor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {vendor.status === "APPROVED" && vendor.is_active && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          href={`/marketplace/stores/${vendor.slug}`}
                          target="_blank"
                        >
                          View public store
                        </Link>
                      </Button>
                    )}

                    {/* Dashboard link */}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/vendor/dashboard">
                        Go to vendor dashboard
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {vendor ? "Save changes" : "Create store profile"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-6 h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-[500px] animate-pulse rounded-xl bg-muted" />
            <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="space-y-6">
            <div className="h-[330px] animate-pulse rounded-xl bg-muted" />
            <div className="h-[220px] animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
