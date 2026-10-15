/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { FinanceService } from "@/app/services/finance.service";
import {
  FinanceLayout,
  PageHeading,
  Panel,
  secondaryButtonClass,
  money,
  ErrorState,
  MetricCard,
  tableWrapClass,
  thClass,
  tdClass,
  EmptyRow,
} from "@/components/finance/FinanceUI";

type Reconciliation = {
  reconciled_count?: number;
  unreconciled_count?: number;
  reconciled_amount?: number | string;
  unreconciled_amount?: number | string;
  unreconciled_payments?: Array<{
    id: string;
    reference: string;
    payment_date: string;
    invoice_id: string;
    amount: number | string;
  }>;
};

export default function FinanceAccountingPage() {
  const [report, setReport] = useState<Reconciliation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await FinanceService.reconciliation({});
      setReport(result as Reconciliation);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail || "Unable to load the finance summary.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  return (
    <FinanceLayout>
      <PageHeading
        title="Finance records"
        description="LERNA keeps the accounting records up to date automatically. You do not need to manage ledgers or accounting codes."
        action={
          <button onClick={load} className={secondaryButtonClass}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}

      <div className="mb-5 rounded-2xl border bg-card p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold">Nothing extra to enter here</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              When you record a student payment, school expense or salary
              payment, LERNA updates the underlying financial records for you.
              Use this page only when you want to check that payment records are
              complete.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Payments recorded"
          value={String(report?.reconciled_count ?? 0)}
          hint="Payment records linked successfully"
          icon={CheckCircle2}
          accent="green"
        />
        <MetricCard
          label="Payments to review"
          value={String(report?.unreconciled_count ?? 0)}
          hint="Records that may need attention"
          icon={AlertCircle}
          accent="orange"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Amount in complete records
          </p>
          <p className="mt-2 text-2xl font-bold">
            {money(report?.reconciled_amount)}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Amount in records to review
          </p>
          <p className="mt-2 text-2xl font-bold">
            {money(report?.unreconciled_amount)}
          </p>
        </div>
      </div>

      <Panel
        title="Payments to review"
        description="If this list is empty, there are no payment records flagged by this check."
      >
        <div className={tableWrapClass}>
          <table className="w-full min-w-[620px]">
            <thead>
              <tr>
                <th className={thClass}>Receipt / reference</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Invoice reference</th>
                <th className={thClass}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(report?.unreconciled_payments ?? []).map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className={tdClass + " font-medium"}>
                    {payment.reference || "No reference"}
                  </td>
                  <td className={tdClass}>{payment.payment_date}</td>
                  <td className={tdClass}>{payment.invoice_id}</td>
                  <td className={tdClass + " font-semibold"}>
                    {money(payment.amount)}
                  </td>
                </tr>
              ))}
              {!(report?.unreconciled_payments ?? []).length && (
                <EmptyRow colSpan={4}>
                  {loading
                    ? "Checking payment records…"
                    : "Everything looks good. There are no payment records to review."}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </FinanceLayout>
  );
}
