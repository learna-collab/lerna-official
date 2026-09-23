"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";

import { MarketplaceOrder } from "@/app/types/marketplace";
import { MarketplaceOrderService } from "@/app/services/orders";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
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
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "PROCESSING":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "SHIPPED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "DELIVERED":
      return "bg-green-50 text-green-700 border-green-200";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function OrderCard({ order }: { order: MarketplaceOrder }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />

            <h2 className="font-semibold text-slate-900">
              {order.order_number}
            </h2>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />

            <span>{formatDate(order.created_at)}</span>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
            order.status,
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">
                {item.title}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-medium text-slate-900">
                {formatCurrency(item.subtotal)}
              </p>

              {item.quantity > 1 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(item.unit_price)} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order total</p>

          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(order.total_amount)}
          </p>
        </div>

        <Link
          href={`/marketplace/orders/${order.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50"
        >
          View order
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function MarketplaceOrdersPage() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await MarketplaceOrderService.getOrders();

        setOrders(response.orders);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/marketplace"
            className="transition-colors hover:text-primary"
          >
            Marketplace
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Orders</span>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Orders
            </h1>

            <p className="mt-2 text-muted-foreground">
              View and track your marketplace purchases.
            </p>
          </div>

          <Link
            href="/marketplace/listings"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-white">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />

            <p className="text-sm">Loading your orders...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border bg-white px-6 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBag className="h-8 w-8 text-slate-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No orders yet
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            You haven&apos;t placed any marketplace orders yet. Browse our
            products and services to get started.
          </p>

          <Link
            href="/marketplace/listings"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Orders */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
