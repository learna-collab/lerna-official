"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { AcademicSetupService } from "@/app/services/academicSetup.service";
import { StudentService } from "@/app/services/student.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/app/store/auth-store";

type AttendanceRecord = {
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
};

export default function StudentAttendancePage() {
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);

        // Use existing academic period service
        const current = await AcademicSetupService.getCurrentAcademicPeriod();

        if (!current?.session_id || !current?.term_id) {
          setRecords([]);
          setSummary(null);
          return;
        }

        const [attendanceData, summaryData] = await Promise.all([
          StudentService.getAttendance(current.session_id, current.term_id),
          StudentService.getAttendanceSummary(
            current.session_id,
            current.term_id,
          ),
        ]);

        const attendanceRecords: AttendanceRecord[] =
          attendanceData?.records ?? [];

        setRecords(attendanceRecords);
        setSummary(summaryData || null);
      } catch (error) {
        console.error(error);
        setRecords([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }

    if (isLoadingAuth) return;
    if (!accessToken) return;

    void loadAttendance();
  }, [isLoadingAuth, accessToken]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 p-6 md:p-8">
      <DashboardHeader title="Attendance" />

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {summary?.present ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absent</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {summary?.absent ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {summary?.late ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {summary?.attendance_rate ?? 0}%
          </CardContent>
        </Card>
      </div>

      {/* HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "default"
                            : record.status === "LATE"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
