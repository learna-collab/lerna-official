"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { UserButton } from "../auth/userbutton";
import { useAuthStore } from "@/app/store/auth-store";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      pathname === path ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const closeMenu = () => setOpen(false);

  const dashboardLinks = {
    SUPER_ADMIN: {
      href: "/admin",
      title: "🛠 Super Admin",
      subtitle: "Manage System",
      desktopClass:
        "relative px-4 py-1.5 rounded-full text-sm font-semibold transition bg-white text-brand-orange shadow-md hover:scale-105 after:content-[''] after:absolute after:-right-1 after:-top-1 after:w-2 after:h-2 after:bg-green-400 after:rounded-full after:animate-pulse",
      mobileClass:
        "px-4 py-2 rounded-lg bg-white text-brand-orange font-semibold flex items-center gap-2",
    },

    SCHOOL_ADMIN: {
      href: "/school-admin",
      title: "🎓 School Admin",
      subtitle: "Manage School",
      desktopClass:
        "relative px-4 py-1.5 rounded-full text-sm font-semibold transition bg-white/10 text-white border border-white/20 hover:bg-white hover:text-brand-orange hover:scale-105 after:content-[''] after:absolute after:-right-1 after:-top-1 after:w-2 after:h-2 after:bg-blue-400 after:rounded-full after:animate-pulse",
      mobileClass:
        "px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 flex items-center gap-2",
    },

    TEACHER: {
      href: "/teacher",
      title: "👨‍🏫 Teacher",
      subtitle: "My Classes",
      desktopClass:
        "relative px-4 py-1.5 rounded-full text-sm font-semibold transition bg-indigo-500/20 text-white border border-indigo-400/30 hover:bg-indigo-500 hover:text-white hover:scale-105",
      mobileClass:
        "px-4 py-2 rounded-lg bg-indigo-500/20 text-white border border-indigo-400/30 flex items-center gap-2",
    },

    STUDENT: {
      href: "/student",
      title: "🎒 Student",
      subtitle: "My Dashboard",
      desktopClass:
        "relative px-4 py-1.5 rounded-full text-sm font-semibold transition bg-emerald-500/20 text-white border border-emerald-400/30 hover:bg-emerald-500 hover:text-white hover:scale-105",
      mobileClass:
        "px-4 py-2 rounded-lg bg-emerald-500/20 text-white border border-emerald-400/30 flex items-center gap-2",
    },

    PARENT: {
      href: "/parent",
      title: "👨‍👩‍👧 Parent",
      subtitle: "My Children",
      desktopClass:
        "relative px-4 py-1.5 rounded-full text-sm font-semibold transition bg-amber-500/20 text-white border border-amber-400/30 hover:bg-amber-500 hover:text-white hover:scale-105",
      mobileClass:
        "px-4 py-2 rounded-lg bg-amber-500/20 text-white border border-amber-400/30 flex items-center gap-2",
    },
  } as const;

  const dashboardLink =
    user?.role && dashboardLinks[user.role as keyof typeof dashboardLinks];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-orange border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* Logo */}
          <div className="relative h-11 w-11 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Lerna Logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Brand */}
          <div className="flex flex-col justify-center leading-none -mt-px">
            <span className="text-2xl font-semibold tracking-tight text-white">
              LERNA
            </span>

            <span className="text-[12px] uppercase tracking-[0.28em] text-white/60 mt-0.5">
              Educational Hub
            </span>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center gap-10 pl-8">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/pricing" className={linkClass("/pricing")}>
            Packages
          </Link>

          <Link href="/about" className={linkClass("/about")}>
            About Us
          </Link>
          <Link href="/blogs" className={linkClass("/blogs")}>
            Blogs
          </Link>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="text-white"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-brand-orange">
          <div className="px-6 py-6 flex flex-col gap-6">
            <Link href="/" onClick={closeMenu} className={linkClass("/")}>
              Home
            </Link>

            <Link
              href="/pricing"
              onClick={closeMenu}
              className={linkClass("/pricing")}
            >
              Packages
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className={linkClass("/about")}
            >
              About Us
            </Link>

            <Link
              href="/blogs"
              onClick={closeMenu}
              className={linkClass("/blogs")}
            >
              Blogs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
