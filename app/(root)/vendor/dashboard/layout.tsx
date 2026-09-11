"use client";

import Link from "next/link";
import { LogOut, Store } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/auth-store";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/vendor/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/vendor/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="leading-none">LERNA Marketplace</p>
              <p className="mt-1 text-xs font-normal text-muted-foreground">
                Vendor Dashboard
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/vendor/dashboard">Dashboard</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/vendor/dashboard/listings">Listings</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/vendor/dashboard/profile">Store Profile</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link href="/vendor/dashboard/settings">Settings</Link>
            </Button>
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="pt-20">{children}</main>
    </div>
  );
}
