"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "STUDENT" | "TEACHER" | "PARENT" | "SCHOOL_ADMIN";

export default function LoginForm() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("STUDENT");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await AuthService.login(username.trim(), password);

      useAuthStore.setState({
        user: result.user,
        accessToken: result.access_token,
      });

      if (!result.user.profile_completed) {
        router.replace("/complete-profile");
        return;
      }

      switch (result.user.role) {
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
    } catch (err: any) {
      console.error("Login Error:", err);

      // No internet connection
      if (!navigator.onLine) {
        setError(
          "No internet connection. Please check your network and try again.",
        );
        return;
      }

      // Network error (backend unreachable)
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError(
          "Unable to connect to the server. Please try again in a moment.",
        );
        return;
      }

      // Request timeout
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
        return;
      }

      switch (err.response.status) {
        case 401:
          setError("Invalid username or password.");
          break;

        case 403:
          setError("You do not have permission to access this portal.");
          break;

        case 404:
          setError("Login service is unavailable.");
          break;

        case 500:
          setError("Server error. Please try again later.");
          break;

        default:
          setError(
            err.response.data?.detail || "Login failed. Please try again.",
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-900
        via-blue-950
        to-blue-900
        px-6
      "
    >
      <div className="w-full max-w-md">
        {/* BRAND */}

        <div className="mb-8 flex items-center justify-center gap-4 text-white">
          <div
            className="
      flex
      h-20
      w-20
      items-center
      justify-center
      rounded-2xl
      p-2
      ring-2
      bg-white/10 backdrop-blur border border-white/20 shadow-lg
    "
          >
            <Image
              src="/logo.png"
              alt="School Logo"
              width={65}
              height={65}
              className="
        h-14
        w-14
        object-contain
      "
              priority
            />
          </div>

          <div className="text-left">
            <h1
              className="
        text-3xl
        font-bold
        leading-tight
      "
            >
              School Portal
            </h1>

            <div
              className="
        mt-1
        flex
        items-center
        gap-2
      "
            >
              <span
                className="
          h-1.5
          w-1.5
          rounded-full
          bg-blue-400
        "
              />

              <p
                className="
          text-sm
          font-medium
          text-blue-200
        "
              >
                Digital Learning System
              </p>
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}

        <form
          onSubmit={submit}
          className="
            rounded-3xl
            bg-white
            p-8
            shadow-2xl
          "
        >
          <div className="space-y-6">
            {/* ROLE */}

            <div className="space-y-2">
              <Label>Login As</Label>

              <Select
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger
                  className="
                    h-12
                    rounded-xl
                  "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>

                  <SelectItem value="TEACHER">Teacher</SelectItem>

                  <SelectItem value="PARENT">Parent</SelectItem>

                  <SelectItem value="SCHOOL_ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
              >
                {error}
              </div>
            )}

            {/* USERNAME */}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="
                  h-12
                  rounded-xl
                "
              />
            </div>

            {/* PASSWORD */}

            <div className="space-y-2">
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <Label htmlFor="password">Password</Label>

                <Link
                  href="/forgot-password"
                  className="
                    text-sm
                    font-medium
                    text-blue-600
                    hover:underline
                  "
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    h-12
                    rounded-xl
                    pr-12
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    hover:text-blue-600
                  "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}

            <Button
              type="submit"
              disabled={loading}
              className="
                h-12
                w-full
                rounded-xl
                bg-blue-600
                text-base
                font-semibold
                hover:bg-blue-700
              "
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {/* REGISTER */}

          <div
            className="
              mt-8
              border-t
              pt-6
              text-center
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Need a school portal?
            </p>

            <a
              href="https://forms.gle/zGFNu9539FcPUcWB6"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-3
                inline-flex
                rounded-xl
                bg-blue-600
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              Register School
            </a>

            <p
              className="
                mt-3
                text-xs
                text-slate-500
              "
            >
              Submit your school application and receive administrator access
              details.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
