"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { ProfileService } from "@/app/services/profile.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  user: any;
  profile: any;
}

export function StudentProfileForm({ user, profile }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    admission_date: profile?.admission_date ?? "",
    gender: profile?.gender ?? "",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function save() {
    try {
      setLoading(true);

      await ProfileService.updateProfile(form);

      toast.error("Profile updated successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* PROFILE HEADER */}
      <Card>
        <CardContent className="pt-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h2>

            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium">
              Student Account
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACCOUNT INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>

          <CardDescription>
            Basic information linked to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Email Address</Label>

              <Input value={user.email} disabled />
            </div>

            <div>
              <Label>Admission Number</Label>

              <Input value={profile?.admission_number ?? ""} disabled />
            </div>

            <div>
              <Label>Class</Label>

              <Input value={profile?.school_class?.name ?? "-"} disabled />
            </div>

            <div>
              <Label>Role</Label>

              <Input value="Student" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PERSONAL INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>

          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>First Name</Label>

              <Input
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Name</Label>

              <Input
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Gender</Label>

              <Select
                value={form.gender}
                onValueChange={(value) => update("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>

                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date of Birth</Label>

              <Input
                type="date"
                value={form.date_of_birth || ""}
                onChange={(e) => update("date_of_birth", e.target.value)}
              />
            </div>

            <div>
              <Label>Admission Date</Label>

              <Input
                type="date"
                value={form.admission_date || ""}
                onChange={(e) => update("admission_date", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={save} disabled={loading}>
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
