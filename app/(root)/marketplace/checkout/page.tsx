/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { CheckoutService } from "@/app/services/checkout";
import { PaymentService } from "@/app/services/payment";
import { useCartStore } from "@/app/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, loading: cartLoading, loadCart } = useCartStore();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const formatPrice = (value: number | string) => {
    return `₦${Number(value).toLocaleString()}`;
  };

  const handlePayment = async () => {
    if (checkoutLoading || !cart || cart.items.length === 0) {
      return;
    }

    try {
      setCheckoutLoading(true);
      setError(null);

      /*
       * Create one marketplace checkout.
       *
       * The backend groups items by vendor and creates
       * the required vendor-specific orders underneath
       * this checkout.
       */
      const checkout = await CheckoutService.create();

      if (!checkout?.id) {
        throw new Error("Unable to create your checkout.");
      }

      /*
       * Initialize one Paystack transaction for the
       * complete checkout amount.
       */
      const payment = await PaymentService.initializeCheckout(checkout.id);

      if (!payment?.checkout_url) {
        throw new Error("Unable to initialize payment.");
      }

      /*
       * Redirect the customer to Paystack.
       */
      window.location.href = payment.checkout_url;
    } catch (err: any) {
      console.error("Checkout failed:", err);
      console.error("Backend response:", err?.response?.data);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to start checkout. Please try again.",
      );

      setCheckoutLoading(false);
    }
  };

  /*
   * Initial loading state
   */
  if (cartLoading && !cart) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-muted" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="h-32 rounded-2xl bg-muted" />
                <div className="h-52 rounded-2xl bg-muted" />
                <div className="h-40 rounded-2xl bg-muted" />
              </div>

              <div className="h-96 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Empty cart
   */
  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              Nothing to checkout
            </h1>

            <p className="mt-3 leading-6 text-muted-foreground">
              Your cart is currently empty. Add something to your cart before
              proceeding to checkout.
            </p>

            <Button
              className="mt-7"
              onClick={() => router.push("/marketplace/listings")}
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/marketplace/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-medium text-muted-foreground">
              Secure checkout
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Lerna Marketplace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review your order and continue to secure payment with Paystack.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="mt-0.5">
              <CheckCircle2 className="h-5 w-5 rotate-45 text-destructive" />
            </div>

            <div>
              <p className="font-medium text-destructive">
                Payment could not be started
              </p>

              <p className="mt-1 text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Customer information */}
            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Order Information
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Your order will be processed using your Lerna account
                      details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Customer account confirmed
                    </p>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      Your marketplace order is being placed under your
                      authenticated Lerna account.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <h2 className="font-semibold text-slate-900">Order Review</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {cart.total_items}{" "}
                    {cart.total_items === 1 ? "item" : "items"} in this order
                  </p>
                </div>

                <Link
                  href="/marketplace/cart"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit cart
                </Link>
              </div>

              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 px-6 py-5">
                    {/* Product placeholder */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Package className="h-7 w-7 text-slate-400" />
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-medium text-slate-900">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-slate-900">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>

                      <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t bg-slate-50 px-6 py-4">
                <Link
                  href="/marketplace/cart"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to cart to make changes
                </Link>
              </div>
            </section>

            {/* Payment */}
            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">Payment</h2>

                    <p className="text-sm text-muted-foreground">
                      Complete your payment securely with Paystack.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="flex items-center gap-4 rounded-xl border p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Pay with Paystack
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Secure payment for your complete marketplace order.
                    </p>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                  <p className="text-sm leading-5 text-muted-foreground">
                    Your payment details are entered securely on Paystack. Lerna
                    does not store your card details.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              {/* Summary heading */}
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Summary
                </h2>
              </div>

              {/* Summary */}
              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>

                  <span className="font-medium text-slate-900">
                    {cart.total_items}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span className="font-medium text-slate-900">
                    {formatPrice(cart.total_amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>

                  <span className="text-right text-xs font-medium text-muted-foreground">
                    Where applicable
                  </span>
                </div>

                <div className="border-t pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {cart.currency}
                      </p>
                    </div>

                    <p className="text-2xl font-bold tracking-tight text-slate-900">
                      {formatPrice(cart.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Pay button */}
                <Button
                  type="button"
                  className="h-12 w-full gap-2 text-base font-semibold"
                  onClick={handlePayment}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirecting to Paystack...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Pay {formatPrice(cart.total_amount)}
                    </>
                  )}
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  By proceeding, you will be redirected to Paystack to securely
                  complete your payment.
                </p>
              </div>

              {/* Trust indicators */}
              <div className="border-t bg-slate-50 px-6 py-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Secure payment processing
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Protected by Paystack
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Order confirmation after payment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to marketplace */}
            <Link
              href="/marketplace"
              className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue browsing marketplace
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
