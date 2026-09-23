"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Package,
  Truck,
} from "lucide-react";

import { MarketplaceOrder } from "@/app/types/marketplace";
import { MarketplaceOrderService } from "@/app/services/orders";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PAID_HELD":
      return "Payment Held";

    case "PROCESSING":
      return "Processing";

    case "SHIPPED":
      return "Shipped";

    case "DELIVERED":
      return "Delivered";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "REFUNDED":
      return "Refunded";

    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PAID_HELD":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "PROCESSING":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "SHIPPED":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "DELIVERED":
      return "border-green-200 bg-green-50 text-green-700";

    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "CANCELLED":
    case "REFUNDED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    {
      key: "PAID_HELD",
      label: "Payment confirmed",
      description: "Your payment has been received.",
      icon: CheckCircle2,
    },
    {
      key: "PROCESSING",
      label: "Processing",
      description: "The vendor is preparing your order.",
      icon: Package,
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      description: "Your order has been dispatched.",
      icon: Truck,
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      description: "Your order has been delivered.",
      icon: CheckCircle2,
    },
    {
      key: "COMPLETED",
      label: "Completed",
      description: "The order has been completed.",
      icon: CheckCircle2,
    },
  ];

  const statusOrder = [
    "PENDING",
    "PAID_HELD",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED",
  ];

  const currentIndex = statusOrder.indexOf(status);

  const cancelled = status === "CANCELLED";

  const refunded = status === "REFUNDED";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Order status</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Track the progress of your order.
        </p>
      </div>

      {cancelled || refunded ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-red-600" />

            <div>
              <p className="font-semibold text-red-700">
                {getStatusLabel(status)}
              </p>

              <p className="mt-1 text-sm text-red-600">
                This order is no longer being processed.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;

            const stepIndex = statusOrder.indexOf(step.key);

            const completed = currentIndex >= stepIndex;

            const isCurrent = status === step.key;

            return (
              <div key={step.key} className="relative flex gap-4">
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-9 h-10 w-px ${
                      completed ? "bg-primary" : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                <div className="pt-0.5">
                  <p
                    className={`font-medium ${
                      isCurrent || completed
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      completed ? "text-muted-foreground" : "text-slate-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MarketplaceOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const { orderId } = await params;

        const data = await MarketplaceOrderService.getOrder(orderId);

        setOrder(data);
      } catch (error) {
        console.error("Failed to load order:", error);

        setError("Unable to load this order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [params]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[600px] max-w-6xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />

          <p className="text-sm">Loading order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto flex min-h-[600px] max-w-6xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Package className="h-8 w-8 text-slate-500" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          Order not found
        </h1>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {error ?? "We couldn't find the order you're looking for."}
        </p>

        <Link
          href="/marketplace/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/marketplace" className="hover:text-primary">
          Marketplace
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link href="/marketplace/orders" className="hover:text-primary">
          Orders
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span>{order.order_number}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/marketplace/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {order.order_number}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(order.created_at)}
            </span>

            <span>•</span>

            <span>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
            order.status,
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Items */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Order items
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Items included in this vendor order.
              </p>
            </div>

            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <Package className="h-6 w-6 text-slate-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">{item.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(item.unit_price)} per item
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <StatusTimeline status={order.status} />
        </div>

        {/* Summary */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items</span>

                <span className="font-medium text-slate-900">
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order amount</span>

                <span className="font-medium text-slate-900">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total</span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment protection */}
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="font-medium text-slate-900">Payment protection</p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Your payment is held while the order is being fulfilled and is
                  released according to the marketplace fulfillment process.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
