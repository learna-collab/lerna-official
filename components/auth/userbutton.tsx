"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { User, LogOut, LogIn, Shield } from "lucide-react";

import { LogoutButton } from "./logout-button";
import { LoginButton } from "./login-button";

import { useAuthStore } from "@/app/store/auth-store";

export const UserButton = () => {
  const user = useAuthStore((s) => s.user);

  const [open, setOpen] = useState(false);

  const initials =
    user?.first_name || user?.last_name
      ? `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase()
      : "U";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* ================= TRIGGER ================= */}
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full transition hover:scale-105 focus:outline-none">
          <Avatar className="h-9 w-9 border border-white/20 bg-white/10">
            <AvatarFallback className="bg-white text-brand-orange font-semibold">
              {user ? initials : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* ================= DROPDOWN ================= */}
      <DropdownMenuContent
        className="w-72 rounded-xl border border-white/10 bg-brand-orange text-white p-2 shadow-xl"
        align="end"
      >
        {/* ================= LOGGED IN ================= */}
        {user && (
          <>
            <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white focus:bg-white/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white text-brand-orange font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {user.first_name} {user.last_name}
                  </span>

                  {user.role === "SCHOOL_ADMIN" && (
                    <span className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      <Shield className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>

                <span className="text-xs text-white/60 truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-white/10" />

            <LogoutButton redirectTo="/login">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/20 focus:bg-red-500/20">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </LogoutButton>
          </>
        )}

        {/* ================= LOGGED OUT ================= */}
        {!user && (
          <LoginButton>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-white/10 focus:bg-white/10">
              <LogIn className="h-4 w-4" />
              Login
            </DropdownMenuItem>
          </LoginButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
