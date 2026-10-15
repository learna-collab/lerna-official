/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BookOpenCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileText,
  Receipt,
  WalletCards,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const links = [
  {
    href: "/school-admin/finance",
    label: "Overview",
    icon: ChartNoAxesCombined,
  },
  { href: "/school-admin/finance/fees", label: "Term fees", icon: WalletCards },
  {
    href: "/school-admin/finance/invoices",
    label: "Payments & receipts",
    icon: Receipt,
  },
  {
    href: "/school-admin/finance/expenses",
    label: "Expenses",
    icon: BadgeDollarSign,
  },
  { href: "/school-admin/finance/payroll", label: "Payroll", icon: Users },
  {
    href: "/school-admin/finance/accounting",
    label: "Reports",
    icon: BookOpenCheck,
  },
];

export function FinanceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-blue-50 via-white to-orange-50 p-5 dark:from-blue-950/30 dark:via-background dark:to-orange-950/20 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <BriefcaseBusiness className="h-4 w-4" /> LERNA · SCHOOL FINANCE
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Finance management
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Set term fees, record payments, track school spending and manage
              staff salaries without the accounting complexity.
            </p>
          </div>
          <div className="rounded-xl border bg-background/80 px-4 py-3 text-sm">
            <p className="font-semibold">Financial control centre</p>
            <p className="text-muted-foreground">
              Amounts are recorded in your school&apos;s currency.
            </p>
          </div>
        </div>
      </div>
      <nav
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Finance navigation"
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/school-admin/finance"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "bg-background hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: any;
  accent?: "blue" | "orange" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    green:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    purple:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  };
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colors[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border bg-card shadow-sm ${className}`}>
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";
export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50";
export const tableWrapClass = "overflow-x-auto rounded-xl border";
export const thClass =
  "whitespace-nowrap bg-muted/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
export const tdClass = "whitespace-nowrap px-4 py-3 text-sm";
export function EmptyRow({
  colSpan,
  children = "No records found.",
}: {
  colSpan: number;
  children?: ReactNode;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-muted-foreground"
      >
        {children}
      </td>
    </tr>
  );
}
export function StatusPill({ value }: { value: string }) {
  const tone = ["PAID", "PUBLISHED", "POSTED", "ACTIVE", "RECONCILED"].includes(
    value.toUpperCase(),
  )
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
    : ["OVERDUE", "REJECTED", "CANCELLED", "VOID", "UNPAID"].includes(
          value.toUpperCase(),
        )
      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
export function money(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
export function dateToday() {
  return new Date().toISOString().slice(0, 10);
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
      {message}
      {retry && (
        <button onClick={retry} className="ml-3 underline">
          Try again
        </button>
      )}
    </div>
  );
}
