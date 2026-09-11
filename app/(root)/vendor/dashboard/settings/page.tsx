"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
  Store,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

interface Vendor {
  id: string;
  user_id: string;
  vendor_type: "INDIVIDUAL" | "BUSINESS";
  store_name: string;
  business_name?: string | null;
  slug: string;
  description?: string | null;
  phone?: string | null;
  public_email?: string | null;
  address?: string | null;
  logo_url?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  is_active: boolean;
}

interface FormState {
  vendor_type: "INDIVIDUAL" | "BUSINESS";
  store_name: string;
  business_name: string;
  description: string;
  phone: string;
  public_email: string;
  address: string;
  logo_url: string;
}

const initialForm: FormState = {
  vendor_type: "INDIVIDUAL",
  store_name: "",
  business_name: "",
  description: "",
  phone: "",
  public_email: "",
  address: "",
  logo_url: "",
};

function StatusBadge({ status }: { status: Vendor["status"] }) {
  const config = {
    PENDING: {
      label: "Pending approval",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    APPROVED: {
      label: "Approved",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    REJECTED: {
      label: "Rejected",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "border-slate-200 bg-slate-100 text-slate-700",
    },
  };

  const current = config[status];

  return (
    <Badge variant="outline" className={current.className}>
      {status === "APPROVED" && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}

      {current.label}
    </Badge>
  );
}

export default function VendorSettingsPage() {
  const { user, hydrated, isLoading } = useAuthStore();

  const [vendor, setVendor] = useState<Vendor | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MarketplaceVendorService.getProfile();

      setVendor(data);

      setForm({
        vendor_type: data.vendor_type ?? "INDIVIDUAL",
        store_name: data.store_name ?? "",
        business_name: data.business_name ?? "",
        description: data.description ?? "",
        phone: data.phone ?? "",
        public_email: data.public_email ?? "",
        address: data.address ?? "",
        logo_url: data.logo_url ?? "",
      });
    } catch (error) {
      console.error("Failed to load vendor settings:", error);

      toast.error("Failed to load your store settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) {
      return;
    }

    if (!user) {
      return;
    }

    if (user.role !== "VENDOR") {
      return;
    }

    Promise.resolve().then(() => loadProfile());
  }, [hydrated, isLoading, user, loadProfile]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!form.store_name.trim()) {
      toast.error("Store name is required");
      return;
    }

    setSaving(true);

    try {
      const updated = await MarketplaceVendorService.updateProfile({
        vendor_type: form.vendor_type,
        store_name: form.store_name.trim(),
        business_name: form.business_name.trim() || undefined,
        description: form.description.trim() || undefined,
        phone: form.phone.trim() || undefined,
        public_email: form.public_email.trim() || undefined,
        address: form.address.trim() || undefined,
        logo_url: form.logo_url.trim() || undefined,
      });

      setVendor(updated);

      setForm({
        vendor_type: updated.vendor_type ?? "INDIVIDUAL",
        store_name: updated.store_name ?? "",
        business_name: updated.business_name ?? "",
        description: updated.description ?? "",
        phone: updated.phone ?? "",
        public_email: updated.public_email ?? "",
        address: updated.address ?? "",
        logo_url: updated.logo_url ?? "",
      });

      toast.success("Store settings updated successfully");
    } catch (error) {
      console.error("Failed to update vendor settings:", error);

      toast.error("Failed to update store settings");
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "VENDOR") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">Access denied</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Only marketplace vendors can access these settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Store className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">Store profile not found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Set up your vendor profile before managing store settings.
            </p>

            <Button className="mt-5" asChild>
              <Link href="/vendor/dashboard/profile">Set up store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/vendor/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />

              <h1 className="text-2xl font-bold tracking-tight">
                Store settings
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your marketplace store information and public contact
              details.
            </p>
          </div>
        </div>

        {vendor.status === "APPROVED" && vendor.is_active && (
          <Button asChild variant="outline">
            <Link href={`/marketplace/stores/${vendor.slug}`} target="_blank">
              View public store
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store information</CardTitle>

              <CardDescription>
                These details describe your marketplace store to customers.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="vendor-type">Vendor type</Label>

                <Select
                  value={form.vendor_type}
                  onValueChange={(value) =>
                    updateField(
                      "vendor_type",
                      value as "INDIVIDUAL" | "BUSINESS",
                    )
                  }
                >
                  <SelectTrigger id="vendor-type">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>

                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-name">Store name</Label>

                <Input
                  id="store-name"
                  value={form.store_name}
                  onChange={(event) =>
                    updateField("store_name", event.target.value)
                  }
                  placeholder="Your store name"
                />
              </div>

              {form.vendor_type === "BUSINESS" && (
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business name</Label>

                  <Input
                    id="business-name"
                    value={form.business_name}
                    onChange={(event) =>
                      updateField("business_name", event.target.value)
                    }
                    placeholder="Registered business name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Store description</Label>

                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Tell customers what your store offers..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL</Label>

                <Input
                  id="logo-url"
                  value={form.logo_url}
                  onChange={(event) =>
                    updateField("logo_url", event.target.value)
                  }
                  placeholder="https://..."
                />

                <p className="text-xs text-muted-foreground">
                  Use a publicly accessible image URL for your store logo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact information</CardTitle>

              <CardDescription>
                Contact details customers can use to reach your store.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>

                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="080..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-email">Public email</Label>

                <Input
                  id="public-email"
                  type="email"
                  value={form.public_email}
                  onChange={(event) =>
                    updateField("public_email", event.target.value)
                  }
                  placeholder="store@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>

                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Store address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}

              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {/* Store status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store status</CardTitle>

              <CardDescription>
                Your marketplace account status.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Approval
                </p>

                <StatusBadge status={vendor.status} />
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Store availability
                </p>

                <Badge
                  variant="outline"
                  className={
                    vendor.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  }
                >
                  {vendor.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Store URL
                </p>

                <p className="break-all text-sm text-muted-foreground">
                  /marketplace/stores/
                  {vendor.slug}
                </p>
              </div>

              {vendor.status === "APPROVED" && vendor.is_active && (
                <Button className="w-full" variant="outline" asChild>
                  <Link
                    href={`/marketplace/stores/${vendor.slug}`}
                    target="_blank"
                  >
                    View public store
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>

              <CardDescription>
                Marketplace account information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Account email</p>

                <p className="mt-1 break-all text-sm font-medium">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Vendor ID</p>

                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {vendor.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Store slug</p>

                <p className="mt-1 font-mono text-sm">{vendor.slug}</p>
              </div>
            </CardContent>
          </Card>

          {vendor.status === "PENDING" && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="font-medium text-amber-900">
                      Approval pending
                    </p>

                    <p className="mt-1 text-sm leading-5 text-amber-800">
                      Your store is currently waiting for marketplace approval.
                      You can continue updating your profile, but listings
                      cannot be published until your vendor account is approved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {vendor.status === "SUSPENDED" && (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="font-medium text-red-900">Store suspended</p>

                    <p className="mt-1 text-sm leading-5 text-red-800">
                      Your vendor account is currently suspended. Contact the
                      marketplace administrator if you need assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
