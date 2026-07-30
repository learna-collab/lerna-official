"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import {
  Pencil,
  Search,
  Copy,
  KeyRound,
  Mail,
  GraduationCap,
  User,
  CheckCircle2,
  School,
} from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Teacher {
  id: string;

  first_name?: string | null;
  last_name?: string | null;

  email: string;

  qualification?: string | null;

  username: string;

  password: string;

  class_name?: string;

  is_active?: boolean;

  profile_completed?: boolean;

  created_at?: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");

  async function loadTeachers() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getSchoolTeachers();

      setTeachers(Array.isArray(response?.teachers) ? response.teachers : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadTeachers());
  }, []);

  const filteredTeachers = useMemo(() => {
    const term = search.toLowerCase();

    return teachers.filter((teacher) => {
      const fullName =
        `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.toLowerCase();

      return (
        fullName.includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.username.toLowerCase().includes(term) ||
        (teacher.class_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [teachers, search]);

  function openEdit(teacher: Teacher) {
    setSelectedTeacher(teacher);

    setFirstName(teacher.first_name ?? "");
    setLastName(teacher.last_name ?? "");
    setEmail(teacher.email ?? "");
    setQualification(teacher.qualification ?? "");

    setEditOpen(true);
  }

  async function saveTeacher() {
    if (!selectedTeacher) return;

    try {
      await SchoolAdminService.updateTeacher(selectedTeacher.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        qualification: qualification || null,
      });

      toast.success("Teacher updated successfully.");

      await loadTeachers();

      setEditOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update teacher.");
    }
  }

  async function copyCredentials(teacher: Teacher) {
    await navigator.clipboard.writeText(
      `Username: ${teacher.username}\nPassword: ${teacher.password}`,
    );

    toast.success("Credentials copied.");
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading teachers...</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Summary Cards */}

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Teachers</p>

              <p className="mt-2 text-3xl font-bold">{teachers.length}</p>
            </div>

            <div className="rounded-xl bg-blue-100 p-4">
              <User className="h-7 w-7 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Classes</p>

              <p className="mt-2 text-3xl font-bold">
                {
                  teachers.filter(
                    (t) => t.class_name && t.class_name.trim() !== "",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl bg-emerald-100 p-4">
              <School className="h-7 w-7 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Credentials Generated
              </p>

              <p className="mt-2 text-3xl font-bold">{teachers.length}</p>
            </div>

            <div className="rounded-xl bg-violet-100 p-4">
              <KeyRound className="h-7 w-7 text-violet-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Table */}

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Teacher Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Search teacher, class, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredTeachers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No teachers found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-5 py-4 text-left">Teacher</th>

                    <th className="px-5 py-4 text-left">Email</th>

                    <th className="px-5 py-4 text-left">Class</th>

                    <th className="px-5 py-4 text-left">Username</th>
                    <th className="px-5 py-4 text-left">Password</th>

                    <th className="px-5 py-4 text-left">Qualification</th>

                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.map((teacher) => {
                    const fullName =
                      `${teacher.first_name ?? ""} ${
                        teacher.last_name ?? ""
                      }`.trim() || "No Name";

                    return (
                      <tr
                        key={teacher.id}
                        className="border-t transition-colors hover:bg-muted/30"
                      >
                        {/* Teacher */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {teacher.first_name?.charAt(0)}
                              {teacher.last_name?.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold">{fullName}</p>

                              <p className="text-xs text-muted-foreground">
                                Teacher
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}

                        <td className="px-5 py-4 text-sm">{teacher.email}</td>

                        {/* Assigned Class */}

                        <td className="px-5 py-4">
                          {teacher.class_name ? (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                              {teacher.class_name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* Username */}

                        <td className="px-5 py-4">
                          <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
                            {teacher.username}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
                            {teacher.password}
                          </div>
                        </td>

                        {/* Qualification */}

                        <td className="px-5 py-4">
                          {teacher.qualification || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyCredentials(teacher)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </Button>

                            <Dialog
                              open={
                                editOpen && selectedTeacher?.id === teacher.id
                              }
                              onOpenChange={(open) => {
                                setEditOpen(open);

                                if (!open) {
                                  setSelectedTeacher(null);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEdit(teacher)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Teacher</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-5">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                      placeholder="First Name"
                                      value={firstName}
                                      onChange={(e) =>
                                        setFirstName(e.target.value)
                                      }
                                    />

                                    <Input
                                      placeholder="Last Name"
                                      value={lastName}
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                    />
                                  </div>

                                  <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />

                                  <Input
                                    placeholder="Qualification"
                                    value={qualification}
                                    onChange={(e) =>
                                      setQualification(e.target.value)
                                    }
                                  />

                                  <div className="rounded-xl border bg-muted/40 p-4">
                                    <h4 className="mb-4 font-semibold">
                                      Login Credentials
                                    </h4>

                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Username
                                        </p>

                                        <p className="font-mono font-semibold">
                                          {selectedTeacher?.username}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Password
                                        </p>

                                        <p className="font-mono font-semibold">
                                          {selectedTeacher?.password}
                                        </p>
                                      </div>
                                    </div>

                                    <Button
                                      className="mt-5 w-full"
                                      variant="secondary"
                                      onClick={() => {
                                        if (selectedTeacher) {
                                          copyCredentials(selectedTeacher);
                                        }
                                      }}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Credentials
                                    </Button>
                                  </div>

                                  <Button
                                    className="w-full"
                                    onClick={saveTeacher}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
