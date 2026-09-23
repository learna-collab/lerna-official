"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/cart-store";

export default function CartPage() {
  const router = useRouter();

  const { cart, loading, loadCart, updateItem, removeItem } = useCartStore();

  const [processingItem, setProcessingItem] = useState<string | null>(null);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const formatPrice = (value: number | string) =>
    `₦${Number(value).toLocaleString()}`;

  const handleUpdate = async (itemId: string, quantity: number) => {
    try {
      setProcessingItem(itemId);
      await updateItem(itemId, quantity);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setProcessingItem(itemId);
      await removeItem(itemId);
    } finally {
      setProcessingItem(null);
    }
  };

  if (loading && !cart) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="grid gap-8 lg:grid-cols-[1.8fr_0.8fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border p-4">
                <div className="h-24 w-24 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-36 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-72 animate-pulse rounded-2xl border bg-muted" />
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>

          <p className="mt-3 text-muted-foreground">
            Looks like you haven&apos;t added anything yet. Explore the
            marketplace and discover products, services, and digital items.
          </p>

          <Button
            className="mt-8"
            onClick={() => router.push("/marketplace/listings")}
          >
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/marketplace/listings"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold">Shopping Cart</h1>

          <p className="mt-2 text-muted-foreground">
            {cart.total_items} {cart.total_items === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.8fr_0.8fr]">
        <section className="space-y-4">
          {cart.items.map((item) => {
            const processing = processingItem === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-lg border">
                        <button
                          onClick={() =>
                            handleUpdate(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          disabled={processing || item.quantity <= 1}
                          className="flex h-10 w-10 items-center justify-center transition hover:bg-muted disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <div className="flex h-10 min-w-12 items-center justify-center border-x px-3 text-sm font-medium">
                          {item.quantity}
                        </div>

                        <button
                          onClick={() =>
                            handleUpdate(item.id, item.quantity + 1)
                          }
                          disabled={processing}
                          className="flex h-10 w-10 items-center justify-center transition hover:bg-muted disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Subtotal
                          </p>

                          <p className="text-lg font-bold">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                          disabled={processing}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{cart.total_items}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency</span>
                <span>{cart.currency}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>

                  <span className="text-2xl font-bold">
                    {formatPrice(cart.total_amount)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Taxes and delivery charges will be calculated during checkout
                  where applicable.
                </p>
              </div>
            </div>

            <Button
              className="mt-6 h-12 w-full text-base"
              onClick={() => router.push("/marketplace/checkout")}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => router.push("/marketplace/listings")}
            >
              Continue Shopping
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
