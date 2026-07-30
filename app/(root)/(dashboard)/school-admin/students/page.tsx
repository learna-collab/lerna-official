"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import {
  Search,
  Pencil,
  Copy,
  KeyRound,
  User,
  GraduationCap,
  School,
  Mail,
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

interface Student {
  id: string;

  first_name: string | null;
  last_name: string | null;

  email: string;

  username: string;
  password: string;

  class_name?: string;

  created_at?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function loadStudents() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getSchoolStudents();

      setStudents(Array.isArray(response?.students) ? response.students : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadStudents());
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();

    return students.filter((student) => {
      const fullName =
        `${student.first_name ?? ""} ${student.last_name ?? ""}`.toLowerCase();

      return (
        fullName.includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.username.toLowerCase().includes(term) ||
        (student.class_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [students, search]);

  function openEdit(student: Student) {
    setSelectedStudent(student);

    setFirstName(student.first_name ?? "");
    setLastName(student.last_name ?? "");
    setEmail(student.email ?? "");
  }

  async function saveStudent() {
    if (!selectedStudent) return;

    try {
      await SchoolAdminService.updateStudent(selectedStudent.id, {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      toast.success("Student updated.");

      await loadStudents();

      setSelectedStudent(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update student.");
    }
  }

  async function copyCredentials(student: Student) {
    await navigator.clipboard.writeText(
      `Username: ${student.username}\nPassword: ${student.password}`,
    );

    toast.success("Credentials copied.");
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading students...</p>
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
              <p className="text-sm text-muted-foreground">Students</p>

              <p className="mt-2 text-3xl font-bold">{students.length}</p>
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
                  students.filter(
                    (s) => s.class_name && s.class_name.trim() !== "",
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

              <p className="mt-2 text-3xl font-bold">{students.length}</p>
            </div>

            <div className="rounded-xl bg-violet-100 p-4">
              <KeyRound className="h-7 w-7 text-violet-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Student Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Search student, class, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No students found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-5 py-4 text-left">Student</th>

                    <th className="px-5 py-4 text-left">Email</th>

                    <th className="px-5 py-4 text-left">Class</th>

                    <th className="px-5 py-4 text-left">Username</th>

                    <th className="px-5 py-4 text-left">Password</th>

                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => {
                    const fullName =
                      `${student.first_name ?? ""} ${
                        student.last_name ?? ""
                      }`.trim() || "No Name";

                    return (
                      <tr
                        key={student.id}
                        className="border-t transition-colors hover:bg-muted/30"
                      >
                        {/* Student */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {student.first_name?.charAt(0)}
                              {student.last_name?.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold">{fullName}</p>

                              <p className="text-xs text-muted-foreground">
                                Student
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}

                        <td className="px-5 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />

                            {student.email}
                          </div>
                        </td>

                        {/* Class */}

                        <td className="px-5 py-4">
                          {student.class_name ? (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                              {student.class_name}
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
                            {student.username}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
                            {student.password}
                          </div>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyCredentials(student)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEdit(student)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Student</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-5">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        First Name
                                      </label>

                                      <Input
                                        value={firstName}
                                        onChange={(e) =>
                                          setFirstName(e.target.value)
                                        }
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Last Name
                                      </label>

                                      <Input
                                        value={lastName}
                                        onChange={(e) =>
                                          setLastName(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Email
                                    </label>

                                    <Input
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />
                                  </div>

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
                                          {selectedStudent?.username}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Password
                                        </p>

                                        <p className="font-mono font-semibold">
                                          {selectedStudent?.password}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Assigned Class
                                        </p>

                                        <p className="font-semibold">
                                          {selectedStudent?.class_name ||
                                            "Not Assigned"}
                                        </p>
                                      </div>
                                    </div>

                                    <Button
                                      className="mt-5 w-full"
                                      variant="secondary"
                                      onClick={() => {
                                        if (selectedStudent) {
                                          copyCredentials(selectedStudent);
                                        }
                                      }}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Credentials
                                    </Button>
                                  </div>

                                  <Button
                                    className="w-full"
                                    onClick={saveStudent}
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
