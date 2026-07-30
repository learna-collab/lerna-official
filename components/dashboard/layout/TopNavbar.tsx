"use client";

import Link from "next/link";
import { Bell, Settings, UserCircle2, LogOut } from "lucide-react";

import { useAuthStore } from "@/app/store/auth-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

function formatRole(role?: string) {
  if (!role) return "Dashboard";

  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";

  return "Good Evening";
}

export default function TopNavbar() {
  const user = useAuthStore((state) => state.user);

  const rolesWithoutProfile = ["SCHOOL_ADMIN"];
  const showProfile = !rolesWithoutProfile.includes(user?.role ?? "");

  const roleBase = user?.role?.toLowerCase().replaceAll("_", "-") ?? "";

  const dashboardTitle = `${formatRole(user?.role)} Dashboard`;

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-border/60
        bg-background/95
        backdrop-blur-xl
      "
    >
      <div className="relative flex h-[72px] items-center px-5 lg:px-8">
        {/* Centered Dashboard Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-center text-xl font-semibold tracking-tight">
            {dashboardTitle}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2">
          <div className="mx-2 hidden h-8 w-px bg-border lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  flex items-center gap-3 rounded-xl p-2
                  transition-colors
                  hover:bg-muted
                "
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user?.school_logo ?? ""} />

                  <AvatarFallback>
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden text-left lg:block">
                  <p className="text-xs text-muted-foreground">
                    {getGreeting()}
                  </p>

                  <p className="text-sm font-semibold">
                    {user?.first_name} {user?.last_name}
                  </p>

                  <p className="text-xs capitalize text-muted-foreground">
                    {formatRole(user?.role)}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
              {showProfile && (
                <DropdownMenuItem asChild>
                  <Link href={`/${roleBase}/profile`}>
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
              )}

              {!showProfile && (
                <DropdownMenuItem asChild>
                  <Link href={`/${roleBase}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <LogoutButton redirectTo="/schoolportal">
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </LogoutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
