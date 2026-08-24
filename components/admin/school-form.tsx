/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CreateSchoolPayload } from "@/app/services/admin.service";

interface Props {
  loading?: boolean;
  onSubmit: (payload: CreateSchoolPayload) => Promise<void>;
}

export default function SchoolForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CreateSchoolPayload>({
    school_name: "",
    website: "",
    phone: "",
    whatsapp_number: "",
    state: "",
    address: "",
    description: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
  });

  // ==========================================
  // UPDATE FORM
  // ==========================================

  function update<K extends keyof CreateSchoolPayload>(
    key: K,
    value: CreateSchoolPayload[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* ==========================================
          SCHOOL INFORMATION
      ========================================== */}

      <div className="space-y-5">
        <h3 className="text-lg font-semibold">School Information</h3>

        <div className="grid gap-5 md:grid-cols-2">
          {/* SCHOOL NAME */}

          <div>
            <Label>School Name *</Label>

            <Input
              value={form.school_name}
              onChange={(e) => update("school_name", e.target.value)}
              placeholder="Enter school name"
              required
              disabled={loading}
            />
          </div>

          {/* WEBSITE */}

          <div>
            <Label>Website</Label>

            <Input
              type="text"
              placeholder="https://school.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* PHONE */}

          <div>
            <Label>Phone *</Label>

            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="08012345678"
              required
              disabled={loading}
            />
          </div>

          {/* WHATSAPP */}

          <div>
            <Label>WhatsApp Number</Label>

            <Input
              type="tel"
              value={form.whatsapp_number}
              onChange={(e) => update("whatsapp_number", e.target.value)}
              placeholder="08012345678"
              disabled={loading}
            />
          </div>

          {/* STATE */}

          <div>
            <Label>State *</Label>

            <Input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="e.g. Imo"
              required
              disabled={loading}
            />
          </div>

          {/* ADDRESS */}

          <div>
            <Label>Address *</Label>

            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="School address"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <Label>Description</Label>

          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Brief description of the school..."
            disabled={loading}
          />
        </div>
      </div>

      {/* ==========================================
          SCHOOL ADMINISTRATOR
      ========================================== */}

      <div className="space-y-5 border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold">School Administrator</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Login credentials will be generated automatically after the school
            is created.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* FIRST NAME */}

          <div>
            <Label>First Name *</Label>

            <Input
              value={form.admin_first_name}
              onChange={(e) => update("admin_first_name", e.target.value)}
              placeholder="Administrator first name"
              required
              disabled={loading}
            />
          </div>

          {/* LAST NAME */}

          <div>
            <Label>Last Name *</Label>

            <Input
              value={form.admin_last_name}
              onChange={(e) => update("admin_last_name", e.target.value)}
              placeholder="Administrator last name"
              required
              disabled={loading}
            />
          </div>

          {/* EMAIL */}

          <div className="md:col-span-2">
            <Label>Email *</Label>

            <Input
              type="email"
              value={form.admin_email}
              onChange={(e) => update("admin_email", e.target.value)}
              placeholder="admin@school.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* GENERATED CREDENTIAL NOTICE */}

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-medium">
            Login credentials generated automatically
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The system will generate a unique username based on the school name
            and a secure password. The credentials will be displayed after
            successful creation.
          </p>
        </div>
      </div>

      {/* ==========================================
          SUBMIT
      ========================================== */}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {loading ? "Creating School..." : "Create School"}
      </Button>
    </form>
  );
}
