/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminService } from "@/app/services/admin.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type School = {
  id: string;
  name: string;
};

interface Props {
  onSuccess?: () => void;
}

export default function CreateSchoolAdminModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    school_id: "",
  });

  // ==========================================
  // LOAD SCHOOLS
  // ==========================================

  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await AdminService.getSchools();

        setSchools(data.items ?? []);
      } catch (err) {
        console.error("Failed to load schools:", err);
        toast.error("Failed to load schools");
      }
    }

    loadSchools();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  function resetForm() {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      school_id: "",
    });
  }

  // ==========================================
  // CREATE SCHOOL ADMIN
  // ==========================================

  async function submit() {
    if (loading) {
      return;
    }

    if (!form.first_name.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!form.last_name.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.school_id) {
      toast.error("Please select a school");
      return;
    }

    try {
      setLoading(true);

      const res = await AdminService.createSchoolAdmin(form);

      toast.success(res.message ?? "School admin created successfully");

      setOpen(false);
      resetForm();

      // Refresh parent table
      onSuccess?.();
    } catch (err: any) {
      console.error("Create school admin error:", err);

      const detail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "Unable to create school admin.";

      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create School Admin</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create School Administrator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                first_name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                last_name: e.target.value,
              })
            }
          />

          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <select
            className="w-full rounded-md border p-3"
            value={form.school_id}
            onChange={(e) =>
              setForm({
                ...form,
                school_id: e.target.value,
              })
            }
          >
            <option value="">Select School</option>

            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>

          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
