/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Loader2,
  Pencil,
  Power,
  PowerOff,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import {
  AdminService,
  CreateSchoolPayload,
  School,
  UpdateSchoolPayload,
} from "@/app/services/admin.service";

import SchoolForm from "@/components/admin/school-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

const PER_PAGE = 10;

export default function SchoolsPage() {
  // ==========================================
  // SCHOOLS
  // ==========================================

  const [schools, setSchools] = useState<School[]>([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  // ==========================================
  // CREATE
  // ==========================================

  const [creating, setCreating] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  // ==========================================
  // EDIT
  // ==========================================

  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const [updating, setUpdating] = useState(false);

  // ==========================================
  // ENABLE / DISABLE
  // ==========================================

  const [togglingSchoolId, setTogglingSchoolId] = useState<string | null>(null);

  // ==========================================
  // CREDENTIALS
  // ==========================================

  const [openCredentials, setOpenCredentials] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // ==========================================
  // EXCEL EXPORT
  // ==========================================

  const [exporting, setExporting] = useState(false);

  // ==========================================
  // LOAD SCHOOLS
  // ==========================================

  async function loadSchools(requestedPage = page, requestedSearch = search) {
    try {
      setLoading(true);

      const res = await AdminService.getSchools({
        search: requestedSearch.trim() || undefined,
        page: requestedPage,
        per_page: PER_PAGE,
      });

      setSchools(
        (res.items ?? []).map((school) => ({
          ...school,
          state: school.state ?? "",
          phone: school.phone ?? "",
          email: school.email ?? "",
        })),
      );

      setTotal(res.total ?? 0);
      setTotalPages(res.total_pages ?? 1);
    } catch (err) {
      console.error("Failed to load schools:", err);
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    void Promise.resolve().then(() => loadSchools(1, ""));
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  function handleSearch(value: string) {
    setSearch(value);

    setPage(1);

    void loadSchools(1, value);
  }

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  function goToPage(nextPage: number) {
    if (loading) {
      return;
    }

    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    if (nextPage === page) {
      return;
    }

    setPage(nextPage);
    void loadSchools(nextPage, search);
  }

  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  async function createSchool(
    payload: CreateSchoolPayload | UpdateSchoolPayload,
  ) {
    if (creating) {
      return;
    }

    try {
      setCreating(true);

      const res = await AdminService.createSchool(
        payload as CreateSchoolPayload,
      );

      toast.success(res.message ?? "School created successfully");

      // ========================================
      // SHOW GENERATED CREDENTIALS
      // ========================================

      if (res.credentials) {
        setCredentials({
          username: res.credentials.username,
          password: res.credentials.password,
        });

        setOpenCredentials(true);
      }

      setOpenCreate(false);

      await loadSchools(page, search);
    } catch (err: any) {
      console.error("Create school error:", err);

      const detail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "Unable to create school.";

      toast.error(detail);
    } finally {
      setCreating(false);
    }
  }

  // ==========================================
  // EDIT SCHOOL
  // ==========================================

  function openEditSchool(school: School) {
    setEditingSchool(school);

    setOpenEdit(true);
  }

  // ==========================================
  // UPDATE SCHOOL
  // ==========================================
  async function updateSchool(
    payload: CreateSchoolPayload | UpdateSchoolPayload,
  ) {
    if (!editingSchool || updating) {
      return;
    }

    try {
      setUpdating(true);

      const res = await AdminService.updateSchool(
        editingSchool.id,
        payload as UpdateSchoolPayload,
      );

      toast.success(res.message ?? "School updated successfully");

      // ========================================
      // SHOW UPDATED CREDENTIALS
      // ========================================
      if (res.credentials) {
        setCredentials({
          username: res.credentials.username,
          password: res.credentials.password,
        });

        setOpenCredentials(true);
      }

      setOpenEdit(false);
      setEditingSchool(null);

      await loadSchools(page, search);
    } catch (err: any) {
      console.error("Update school error:", err);

      const detail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "Unable to update school.";

      toast.error(detail);
    } finally {
      setUpdating(false);
    }
  }

  // ==========================================
  // ENABLE / DISABLE
  // ==========================================

  async function toggleSchool(school: School) {
    if (togglingSchoolId) {
      return;
    }

    try {
      setTogglingSchoolId(school.id);

      if (school.is_active) {
        await AdminService.disableSchool(school.id);

        toast.success(`${school.name} disabled successfully`);
      } else {
        await AdminService.enableSchool(school.id);

        toast.success(`${school.name} enabled successfully`);
      }

      await loadSchools(page, search);
    } catch (err) {
      console.error("Toggle school error:", err);

      toast.error("Operation failed.");
    } finally {
      setTogglingSchoolId(null);
    }
  }

  // ==========================================
  // COPY
  // ==========================================

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);

      toast.success(`${label} copied`);
    } catch (err) {
      console.error("Clipboard error:", err);

      toast.error(`Unable to copy ${label.toLowerCase()}`);
    }
  }

  // ==========================================
  // DOWNLOAD SCHOOLS EXCEL
  // ==========================================

  async function downloadSchoolsExcel() {
    if (exporting) {
      return;
    }

    try {
      setExporting(true);

      const blob = await AdminService.downloadSchoolsExcel(
        search.trim() || undefined,
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `schools-records-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("School records downloaded successfully");
    } catch (err: any) {
      console.error("Excel export error:", err);

      const detail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "Unable to download school records.";

      toast.error(detail);
    } finally {
      setExporting(false);
    }
  }

  // ==========================================
  // PAGE NUMBERS
  // ==========================================

  function getPageNumbers() {
    const pages: number[] = [];

    const start = Math.max(1, page - 2);

    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <div className="space-y-6 p-8">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schools</h1>

            <p className="text-muted-foreground">
              Create schools, manage their administrators and enable or disable
              access.
            </p>
          </div>

          {/* ==========================================
              HEADER ACTIONS
          ========================================== */}

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* ==========================================
                DOWNLOAD EXCEL
            ========================================== */}

            <Button
              type="button"
              variant="outline"
              onClick={downloadSchoolsExcel}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}

              {exporting ? "Downloading..." : "Download Excel"}
            </Button>

            {/* ==========================================
                CREATE SCHOOL
            ========================================== */}

            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button disabled={creating}>Create School</Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New School</DialogTitle>
                </DialogHeader>

                <SchoolForm
                  mode="create"
                  onSubmit={createSchool}
                  loading={creating}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ==========================================
            REGISTERED SCHOOLS
        ========================================== */}

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Registered Schools</CardTitle>

              {/* ==========================================
                  SEARCH
              ========================================== */}

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search schools..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* ==========================================
                LOADING
            ========================================== */}

            {loading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Loading schools...
              </div>
            ) : schools.length === 0 ? (
              /* ==========================================
                  EMPTY
              ========================================== */

              <div className="flex h-40 items-center justify-center text-muted-foreground">
                {search ? "No schools found." : "No schools have been created."}
              </div>
            ) : (
              <>
                {/* ==========================================
                    TABLE
                ========================================== */}

                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School</TableHead>

                        <TableHead>Admin</TableHead>

                        <TableHead>Username</TableHead>

                        <TableHead>Password</TableHead>

                        <TableHead>Status</TableHead>

                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {schools.map((school) => {
                        const admin = school.admin;

                        const isToggling = togglingSchoolId === school.id;

                        return (
                          <TableRow key={school.id}>
                            {/* ==========================================
                                  SCHOOL
                              ========================================== */}

                            <TableCell>
                              <div>
                                <p className="font-semibold">{school.name}</p>

                                <p className="text-xs text-muted-foreground">
                                  {school.slug}
                                </p>
                              </div>
                            </TableCell>

                            {/* ==========================================
                                  ADMIN
                              ========================================== */}

                            <TableCell>
                              <div>
                                <p>
                                  {admin?.first_name} {admin?.last_name}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {admin?.email}
                                </p>
                              </div>
                            </TableCell>

                            {/* ==========================================
                                  USERNAME
                              ========================================== */}

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {admin?.username ?? "-"}
                                </span>

                                {admin?.username && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      copy(admin.username!, "Username")
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>

                            {/* ==========================================
                                  PASSWORD
                              ========================================== */}

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {admin?.password ?? "-"}
                                </span>

                                {admin?.password && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      copy(admin.password!, "Password")
                                    }
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>

                            {/* ==========================================
                                  STATUS
                              ========================================== */}

                            <TableCell>
                              <Badge
                                variant={
                                  school.is_active ? "default" : "destructive"
                                }
                              >
                                {school.is_active ? "Active" : "Disabled"}
                              </Badge>
                            </TableCell>

                            {/* ==========================================
                                  ACTIONS
                              ========================================== */}

                            <TableCell>
                              <div className="flex justify-end gap-2">
                                {/* EDIT */}

                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditSchool(school)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>

                                {/* ENABLE / DISABLE */}

                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={isToggling}
                                  variant={
                                    school.is_active ? "destructive" : "default"
                                  }
                                  onClick={() => toggleSchool(school)}
                                >
                                  {school.is_active ? (
                                    <>
                                      <PowerOff className="mr-2 h-4 w-4" />

                                      {isToggling ? "Disabling..." : "Disable"}
                                    </>
                                  ) : (
                                    <>
                                      <Power className="mr-2 h-4 w-4" />

                                      {isToggling ? "Enabling..." : "Enable"}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* ==========================================
                    PAGINATION
                ========================================== */}

                <div className="mt-4 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {schools.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">{total}</span>{" "}
                    schools
                  </p>

                  <div className="flex items-center gap-1">
                    {/* PREVIOUS */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={loading || page <= 1}
                      onClick={() => goToPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* PAGE NUMBERS */}
                    {getPageNumbers().map((pageNumber) => (
                      <Button
                        type="button"
                        key={pageNumber}
                        size="sm"
                        variant={pageNumber === page ? "default" : "outline"}
                        disabled={loading}
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    ))}

                    {/* NEXT */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={loading || page >= totalPages}
                      onClick={() => goToPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ==========================================
          EDIT SCHOOL
      ========================================== */}

      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);

          if (!open) {
            setEditingSchool(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>

          {editingSchool && (
            <SchoolForm
              key={editingSchool.id}
              mode="edit"
              school={{
                ...editingSchool,
                website: editingSchool.website ?? null,
                subscription_plan: editingSchool.subscription_plan ?? null,
              }}
              onSubmit={updateSchool}
              loading={updating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ==========================================
          SCHOOL ADMIN CREDENTIALS
      ========================================== */}

      <Dialog open={openCredentials} onOpenChange={setOpenCredentials}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>School Created Successfully</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* INFO */}

            <div className="rounded-xl border bg-green-50 p-4">
              <h3 className="font-semibold text-green-700">
                School Administrator Login
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Save these credentials. They will be used by the School
                Administrator to sign into the system.
              </p>
            </div>

            {/* USERNAME */}

            <div>
              <label className="text-sm font-medium">Username</label>

              <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                <span className="font-mono">{credentials.username}</span>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => copy(credentials.username, "Username")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                <span className="font-mono">{credentials.password}</span>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => copy(credentials.password, "Password")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* DONE */}

            <Button
              type="button"
              className="w-full"
              onClick={() => setOpenCredentials(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
