/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { SchoolSettingService } from "@/app/services/school-setting.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SchoolAdminSettingsPage() {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  async function loadSettings() {
    try {
      setInitialLoading(true);

      const data = await SchoolSettingService.getSettings();

      setSchoolName(data.name ?? "");
      setEmail(data.email ?? "");
      setPhone(data.phone ?? "");
      setAddress(data.address ?? "");
      setLogoUrl(data.logo_url ?? "");
    } catch {
      toast.error("Failed to load school settings.");
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadSettings);
  }, []);

  async function saveProfile() {
    try {
      setLoadingProfile(true);

      await SchoolSettingService.updateSettings({
        name: schoolName,
        email,
        phone,
        address,
      });

      toast.success("School profile updated.");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Failed to update profile.");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    try {
      setLoadingPassword(true);

      await SchoolSettingService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Unable to change password.",
      );
    } finally {
      setLoadingPassword(false);
    }
  }

  async function uploadLogo() {
    if (!selectedLogo) {
      toast.error("Please choose a logo.");
      return;
    }

    try {
      setLoadingLogo(true);

      const response = await SchoolSettingService.uploadLogo(selectedLogo);

      setLogoUrl(response.logo_url);

      toast.success("Logo uploaded successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Logo upload failed.");
    } finally {
      setLoadingLogo(false);
    }
  }

  if (initialLoading) {
    return <div className="mx-auto max-w-5xl p-6">Loading settings...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">School Settings</h1>

        <p className="text-muted-foreground">
          Manage your school profile and account security.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SCHOOL PROFILE */}
      {/* ========================================================= */}

      <Card>
        <CardHeader>
          <CardTitle>School Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name</Label>

              <Input
                id="school-name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter school name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-email">School Email</Label>

              <Input
                id="school-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter school email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-phone">Phone Number</Label>

              <Input
                id="school-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-address">Address</Label>

              <Input
                id="school-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter school address"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={loadingProfile}>
              {loadingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* ========================================================= */}
      {/* SCHOOL BRANDING */}
      {/* ========================================================= */}

      <Card>
        <CardHeader>
          <CardTitle>School Branding</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {logoUrl && (
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">
              <Image
                src={logoUrl}
                alt="School Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="school-logo">School Logo</Label>

            <Input
              id="school-logo"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedLogo(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={uploadLogo}
              disabled={loadingLogo}
            >
              {loadingLogo ? "Uploading..." : "Upload Logo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SECURITY */}
      {/* ========================================================= */}

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>

            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>

            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={changePassword} disabled={loadingPassword}>
              {loadingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SYSTEM INFO */}
      {/* ========================================================= */}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Subscription Plan</span>
            <span className="font-medium text-foreground">Basic</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>

          <div className="flex justify-between">
            <span>School Code</span>
            <span className="font-medium text-foreground">
              Managed by System
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
