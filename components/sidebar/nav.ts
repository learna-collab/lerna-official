import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  CalendarDays,
  Settings,
  Shield,
  UserPlus,
  FileText,
  PlusCircle,
  BarChart3,
  UserCog,
  BookCopy,
} from "lucide-react";

import { SidebarGroup } from "./types";
import { getClassChildren, getResultChildren } from "./class-nav";

export function getSidebarNavigation(
  classId?: string,
): Record<string, SidebarGroup[]> {
  return {
    STUDENT: [
      {
        title: "",
        items: [
          {
            label: "Dashboard",
            href: "/student",
            icon: LayoutDashboard,
          },
          {
            label: "Attendance",
            href: "/student/attendance",
            icon: ClipboardCheck,
          },
          {
            label: "Results",
            href: "/student/results",
            icon: GraduationCap,
          },
          {
            label: "Profile",
            href: "/student/profile",
            icon: Settings,
          },
        ],
      },
    ],

    TEACHER: [
      {
        title: "",
        items: [
          {
            label: "Dashboard",
            href: "/teacher",
            icon: LayoutDashboard,
          },
          {
            label: "Classes",
            href: "/teacher/classes",
            icon: School,
          },
          {
            label: "Lessons",
            href: "/teacher/lessons",
            icon: BookOpen,
          },
          {
            label: "Attendance",
            href: "/teacher/attendance",
            icon: ClipboardCheck,
          },
          {
            label: "Results",
            icon: GraduationCap,
            href: "/teacher/results",
          },
          {
            label: "Profile",
            href: "/teacher/profile",
            icon: Settings,
          },
        ],
      },
    ],

    PARENT: [
      {
        title: "",
        items: [
          {
            label: "Dashboard",
            href: "/parent",
            icon: LayoutDashboard,
          },
          {
            label: "My Children",
            href: "/parent/children",
            icon: Users,
          },
          {
            label: "Profile",
            href: "/parent/profile",
            icon: Settings,
          },
        ],
      },
    ],

    SCHOOL_ADMIN: [
      {
        title: "",
        items: [
          {
            label: "Dashboard",
            href: "/school-admin",
            icon: LayoutDashboard,
          },
          {
            label: "CBT",
            href: "/school-admin/cbt",
            icon: GraduationCap,
            children: [
              { label: "CBT Exams", href: "/school-admin/cbt/exams" },
              { label: "CBT Results", href: "/school-admin/cbt/results" },
            ],
          },

          {
            label: "Academic Setup",
            href: "/school-admin/academic-structure",
            icon: GraduationCap,
          },

          {
            label: "Classes",
            href: "/school-admin/classes",
            icon: School,
            children: getClassChildren(classId),
          },

          {
            label: "Students",
            href: "/school-admin/students",
            icon: GraduationCap,
          },

          {
            label: "Teachers",
            href: "/school-admin/teachers",
            icon: UserCog,
          },

          {
            label: "Subjects",
            href: "/school-admin/subjects",
            icon: BookCopy,
          },

          {
            label: "Attendance",
            href: "/school-admin/attendance",
            icon: ClipboardCheck,
          },

          {
            label: "Results",
            href: "/school-admin/results",
            icon: BarChart3,
          },

          {
            label: "Sessions",
            href: "/school-admin/sessions",
            icon: Calendar,
          },

          {
            label: "Terms",
            href: "/school-admin/terms",
            icon: CalendarDays,
          },

          {
            label: "Registrations",
            href: "/school-admin/registrations",
            icon: UserPlus,
          },

          {
            label: "Settings",
            href: "/school-admin/settings",
            icon: Settings,
          },
        ],
      },
    ],

    SUPER_ADMIN: [
      {
        title: "",
        items: [
          {
            label: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
          },

          {
            label: "Schools",
            href: "/admin/schools",
            icon: School,
          },

          {
            label: "Admins",
            href: "/admin/admins",
            icon: Shield,
          },

          {
            label: "Users",
            href: "/admin/users",
            icon: Users,
          },

          {
            label: "Create Blog",
            href: "/admin/blogs/create",
            icon: PlusCircle,
          },

          {
            label: "Blogs",
            href: "/admin/blogs",
            icon: FileText,
          },

          {
            label: "Lesson Notes",
            href: "/admin/lessons",
            icon: BookOpen,
          },

          {
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
          },
        ],
      },
    ],
  };
}
