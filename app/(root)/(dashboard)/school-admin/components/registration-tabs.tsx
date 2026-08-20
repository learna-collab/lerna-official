"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CredentialsDialog from "./credentials-dialog";

// PARTS 2–5
import StudentRegistrationForm from "./student-registration-form";
import TeacherRegistrationForm from "./TeacherRegistrationForm";

import BulkImport from "./bulk-import";

export default function RegistrationTabs() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  function showCredentials(
    a: string | { username: string; password: string },
    b?: string,
  ) {
    let u: string;
    let p: string;

    if (typeof a === "string") {
      u = a;
      p = b ?? "";
    } else {
      u = a.username;
      p = a.password;
    }

    setUsername(u);
    setPassword(p);
    setDialogOpen(true);
  }

  return (
    <>
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>

          <TabsTrigger value="teachers">Teachers</TabsTrigger>

          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentRegistrationForm onSuccess={showCredentials} />
        </TabsContent>

        <TabsContent value="teachers">
          <TeacherRegistrationForm onSuccess={showCredentials} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkImport />
        </TabsContent>
      </Tabs>

      <CredentialsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        username={username}
        password={password}
      />
    </>
  );
}
