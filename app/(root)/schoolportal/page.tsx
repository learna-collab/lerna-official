"use client";

import Link from "next/link";
import Image from "next/image";

import { GraduationCap, ShieldCheck, Users, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/app/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SchoolHomePage() {
  const router = useRouter();

  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !user) {
      return;
    }

    switch (user.role) {
      case "STUDENT":
        router.replace("/student");
        break;

      case "TEACHER":
        router.replace("/teacher");
        break;

      case "PARENT":
        router.replace("/parent");
        break;

      case "SCHOOL_ADMIN":
        router.replace("/school-admin");
        break;

      default:
        router.replace("/admin");
    }
  }, [accessToken, user, router]);
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="border-b bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          {/* LEFT */}

          <div className="space-y-7">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="School Logo"
                  width={62}
                  height={62}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                  School Portal
                </p>

                <h2 className="text-xl font-semibold text-white">
                  Digital Learning System
                </h2>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Everything Your School Needs,
              <span className="block text-blue-300">
                In One Secure Platform
              </span>
            </h1>

            <p className="max-w-xl text-lg text-blue-100">
              Manage students, results, attendance, examinations and
              communication through a simple and reliable school management
              system.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="
    rounded-xl
    bg-blue-500
    px-8
    text-white
    shadow-lg
    shadow-blue-500/30
    hover:bg-blue-400
  "
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="
    rounded-xl
    border-white/30
    bg-white/10
    px-8
    text-white
    backdrop-blur
    hover:bg-white/20
  "
                asChild
              >
                <Link href="/">Visit Website</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT PREVIEW */}

          <div className="relative">
            <div className="rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Welcome back</p>

                  <h3 className="text-2xl font-bold">Student Dashboard</h3>
                </div>

                <GraduationCap className="h-12 w-12 text-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 p-5">
                  <p className="text-sm text-slate-500">Results</p>

                  <p className="mt-2 text-2xl font-bold">Available</p>
                </div>

                <div className="rounded-xl bg-green-50 p-5">
                  <p className="text-sm text-slate-500">Attendance</p>

                  <p className="mt-2 text-2xl font-bold">95%</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border p-4">
                <p className="font-medium">Academic Progress</p>

                <p className="mt-2 text-sm text-slate-500">
                  Track performance, assignments and school activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: GraduationCap,
              title: "Academic Results",
              text: "View grades, report cards and academic records.",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: BookOpen,
              title: "Learning Resources",
              text: "Access assignments and learning materials.",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Users,
              title: "Parent Connection",
              text: "Parents stay updated with student progress.",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: ShieldCheck,
              title: "Secure Platform",
              text: "Reliable authentication and protected data.",
              color: "bg-orange-100 text-orange-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className={`mb-4 w-fit rounded-xl p-3 ${item.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="font-semibold">{item.title}</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="border-t bg-white py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} School Management System
        </p>
      </footer>
    </main>
  );
}
