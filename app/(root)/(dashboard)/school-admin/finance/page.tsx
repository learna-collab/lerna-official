/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CircleDollarSign,
  RefreshCw,
  Users,
  WalletCards,
} from "lucide-react";
import { FinanceService } from "@/app/services/finance.service";
import {
  FinanceLayout,
  MetricCard,
  PageHeading,
  Panel,
  secondaryButtonClass,
  money,
  ErrorState,
} from "@/components/finance/FinanceUI";

export default function FinanceOverviewPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await FinanceService.dashboard());
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "Could not load the finance summary. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  const tasks = [
    {
      href: "/school-admin/finance/fees",
      title: "Set up term fees",
      description:
        "Set school fees and lesson fees for every student, or add class-specific fees such as textbooks.",
      icon: WalletCards,
      step: "1",
    },
    {
      href: "/school-admin/finance/invoices",
      title: "Collect payments",
      description:
        "Find a student, record the amount paid, and keep a receipt reference.",
      icon: Banknote,
      step: "2",
    },
    {
      href: "/school-admin/finance/expenses",
      title: "Record an expense",
      description:
        "Record money the school spends, such as supplies, utilities or repairs.",
      icon: CircleDollarSign,
      step: "3",
    },
    {
      href: "/school-admin/finance/payroll",
      title: "Staff salaries",
      description:
        "Prepare monthly salaries and record when staff have been paid.",
      icon: Users,
      step: "4",
    },
  ];

  return (
    <FinanceLayout>
      <PageHeading
        title="School finance"
        description="Your everyday finance tasks, in a simple order. Choose what you want to do next."
        action={
          <button onClick={load} className={secondaryButtonClass}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}
      <Panel
        title="What would you like to do?"
        description="You do not need to understand accounting to use these tasks. LERNA keeps the financial records in the background."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map(({ href, title, description, icon: Icon, step }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-4 rounded-2xl border p-5 transition hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/20"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step {step}
                </p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Open task{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
      <Panel
        title="Quick overview"
        description="A simple snapshot of the school's recorded money. Refresh after entering new transactions."
      >
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border bg-muted/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Fees collected"
              value={money(summary?.fees_collected ?? 0)}
              hint="Payments recorded"
              icon={Banknote}
              accent="green"
            />
            <MetricCard
              label="Fees still owed"
              value={money(summary?.outstanding_fees ?? 0)}
              hint="Outstanding student balances"
              icon={WalletCards}
              accent="orange"
            />
            <MetricCard
              label="School expenses"
              value={money(summary?.expenses ?? 0)}
              hint="Expenses recorded"
              icon={CircleDollarSign}
              accent="orange"
            />
            <MetricCard
              label="Money movement"
              value={money(summary?.net_cash_movement ?? 0)}
              hint="Recorded collections minus outflows"
              icon={Users}
              accent={
                Number(summary?.net_cash_movement ?? 0) >= 0
                  ? "green"
                  : "orange"
              }
            />
          </div>
        )}
      </Panel>
      <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        Accounting entries and reports are maintained automatically as you
        record fees, payments, expenses and salaries. You only need the
        accounting area when you want to review detailed reports.
      </div>
      <div>
        <Link
          href="/school-admin/finance/accounting"
          className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
        >
          View detailed accounting reports{" "}
          <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>
    </FinanceLayout>
  );
}
