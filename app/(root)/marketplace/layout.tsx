"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Package, ShoppingCart, Store, User } from "lucide-react";

import { useCartStore } from "@/app/store/cart-store";

export default function MarketplacePage({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { cart, loadCart } = useCartStore();

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const cartCount = cart?.total_items ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Marketplace Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Marketplace Name */}
          <Link href="/marketplace" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-bold">Lerna</p>

              <p className="text-xs text-muted-foreground">Marketplace</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              Marketplace
            </Link>

            <Link
              href="/marketplace/orders"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/marketplace/cart"
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />

              <span className="hidden sm:inline">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Marketplace Content */}
      {children}
    </div>
  );
}
