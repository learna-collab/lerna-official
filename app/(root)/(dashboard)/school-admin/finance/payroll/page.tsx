/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Wallet, FileText, Banknote } from "lucide-react";
import { toast } from "sonner";
import {
  FinanceService,
  type FinanceAccount,
  type PayrollRecord,
  type SalaryProfile,
  type PaymentMethod,
} from "@/app/services/finance.service";
import {
  FinanceLayout,
  PageHeading,
  Panel,
  Field,
  inputClass,
  buttonClass,
  secondaryButtonClass,
  money,
  dateToday,
  ErrorState,
  tableWrapClass,
  thClass,
  tdClass,
  EmptyRow,
  StatusPill,
} from "@/components/finance/FinanceUI";
const methods: PaymentMethod[] = [
  "CASH",
  "BANK_TRANSFER",
  "POS",
  "CHEQUE",
  "OTHER",
];
const monthName = (m: number) =>
  new Date(2020, m - 1, 1).toLocaleString("en", { month: "long" });
export default function FinancePayrollPage() {
  const [profiles, setProfiles] = useState<SalaryProfile[]>([]);
  const [rows, setRows] = useState<PayrollRecord[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    employee_user_id: "",
    basic_salary: "",
    default_allowances: "0",
    default_deductions: "0",
    note: "",
  });
  const [period, setPeriod] = useState({
    employee_user_id: "",
    pay_year: String(new Date().getFullYear()),
    pay_month: String(new Date().getMonth() + 1),
  });
  const [payment, setPayment] = useState({
    id: "",
    payment_date: dateToday(),
    payment_method: "BANK_TRANSFER" as PaymentMethod,
    reference: "",
    payment_account_id: "",
  });
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [p, r, a] = await Promise.all([
        FinanceService.salaryProfiles(),
        FinanceService.payroll(),
        FinanceService.accounts(),
      ]);
      setProfiles(Array.isArray(p) ? p : []);
      setRows(Array.isArray(r) ? r : []);
      setAccounts(Array.isArray(a) ? a : []);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Unable to load payroll records.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FinanceService.createSalaryProfile({
        ...profile,
        basic_salary: Number(profile.basic_salary),
        default_allowances: Number(profile.default_allowances),
        default_deductions: Number(profile.default_deductions),
        note: profile.note || undefined,
      });
      toast.success("Salary profile saved.");
      setProfile({
        ...profile,
        employee_user_id: "",
        basic_salary: "",
        note: "",
      });
      await load();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Could not save salary profile.",
      );
    }
  };
  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FinanceService.generatePayrollFromProfile(
        period.employee_user_id,
        Number(period.pay_year),
        Number(period.pay_month),
      );
      toast.success("Payroll record generated.");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not generate payroll.");
    }
  };
  const payRow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FinanceService.payPayroll(payment.id, {
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        reference: payment.reference,
        payment_account_id: payment.payment_account_id,
      });
      toast.success("Salary payment recorded and posted to the ledger.");
      setPayment({ ...payment, id: "", reference: "" });
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not pay payroll record.");
    }
  };
  const downloadPayslip = async (id: string) => {
    try {
      const p = await FinanceService.payslip(id);
      const blob = new Blob([JSON.stringify(p, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip-${p.pay_year}-${String(p.pay_month).padStart(2, "0")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Payslip data exported.");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not load payslip.");
    }
  };
  const assets = accounts.filter(
    (a) => a.account_type === "ASSET" && a.is_active !== false,
  );
  return (
    <FinanceLayout>
      <PageHeading
        title="Staff payroll"
        description="Maintain salary profiles, generate monthly payroll and record salary disbursements."
        action={
          <button onClick={load} className={secondaryButtonClass}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Salary profile"
          description="Use an existing teacher or school-admin user ID. Saving an existing profile updates its salary defaults."
        >
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Employee user UUID">
                <input
                  className={inputClass}
                  value={profile.employee_user_id}
                  onChange={(e) =>
                    setProfile({ ...profile, employee_user_id: e.target.value })
                  }
                  required
                  placeholder="Existing staff user ID"
                />
              </Field>
            </div>
            <Field label="Basic salary (₦)">
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={profile.basic_salary}
                onChange={(e) =>
                  setProfile({ ...profile, basic_salary: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Default allowances (₦)">
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={profile.default_allowances}
                onChange={(e) =>
                  setProfile({ ...profile, default_allowances: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Default deductions (₦)">
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={profile.default_deductions}
                onChange={(e) =>
                  setProfile({ ...profile, default_deductions: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Note (optional)">
              <input
                className={inputClass}
                value={profile.note}
                onChange={(e) =>
                  setProfile({ ...profile, note: e.target.value })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <button className={buttonClass} type="submit">
                <Plus className="h-4 w-4" />
                Save salary profile
              </button>
            </div>
          </form>
        </Panel>
        <Panel
          title="Generate monthly payroll"
          description="Creates one draft payroll record for the employee and selected period."
        >
          <form onSubmit={generate} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Employee salary profile">
                <select
                  className={inputClass}
                  value={period.employee_user_id}
                  onChange={(e) =>
                    setPeriod({ ...period, employee_user_id: e.target.value })
                  }
                  required
                >
                  <option value="">Choose employee</option>
                  {profiles
                    .filter((p) => p.is_active)
                    .map((p) => (
                      <option key={p.id} value={p.employee_user_id}>
                        {p.employee_user_id} · {money(p.basic_salary)} basic
                      </option>
                    ))}
                </select>
              </Field>
            </div>
            <Field label="Year">
              <input
                className={inputClass}
                type="number"
                min="2020"
                max="2100"
                value={period.pay_year}
                onChange={(e) =>
                  setPeriod({ ...period, pay_year: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Month">
              <select
                className={inputClass}
                value={period.pay_month}
                onChange={(e) =>
                  setPeriod({ ...period, pay_month: e.target.value })
                }
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {monthName(m)}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <button
                className={buttonClass}
                type="submit"
                disabled={
                  !profiles.some(
                    (p) =>
                      p.employee_user_id === period.employee_user_id &&
                      p.is_active,
                  )
                }
              >
                <Wallet className="h-4 w-4" />
                Generate payroll
              </button>
            </div>
          </form>
          <div className="mt-5 border-t pt-4">
            <p className="mb-2 text-sm font-medium">Active salary profiles</p>
            <div className="space-y-2">
              {profiles.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                >
                  <span className="font-mono text-xs">
                    {p.employee_user_id}
                  </span>
                  <span>
                    {money(p.basic_salary)} + {money(p.default_allowances)}{" "}
                    allowances
                  </span>
                </div>
              ))}
              {!profiles.length && (
                <p className="text-sm text-muted-foreground">
                  No salary profiles created.
                </p>
              )}
            </div>
          </div>
        </Panel>
      </div>
      <Panel
        title="Payroll register"
        description={`${rows.length} monthly payroll records`}
      >
        <div className={tableWrapClass}>
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr>
                <th className={thClass}>Employee UUID</th>
                <th className={thClass}>Period</th>
                <th className={thClass}>Basic</th>
                <th className={thClass}>Allowances</th>
                <th className={thClass}>Deductions</th>
                <th className={thClass}>Net pay</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Payment</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className={tdClass}>
                    <span className="font-mono text-xs">
                      {r.employee_user_id}
                    </span>
                  </td>
                  <td className={tdClass}>
                    {monthName(r.pay_month)} {r.pay_year}
                  </td>
                  <td className={tdClass}>{money(r.basic_salary)}</td>
                  <td className={tdClass}>{money(r.allowances)}</td>
                  <td className={tdClass}>{money(r.deductions)}</td>
                  <td className={tdClass + " font-semibold"}>
                    {money(r.net_pay)}
                  </td>
                  <td className={tdClass}>
                    <StatusPill value={r.status} />
                  </td>
                  <td className={tdClass}>
                    {r.payment_date || "—"}
                    {r.reference && (
                      <div className="text-xs text-muted-foreground">
                        {r.reference}
                      </div>
                    )}
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setPayment({
                            ...payment,
                            id: r.id,
                            reference: "",
                            payment_account_id: assets[0]?.id || "",
                          })
                        }
                        disabled={r.status === "PAID"}
                        className={secondaryButtonClass}
                      >
                        <Banknote className="h-4 w-4" />
                        Pay
                      </button>
                      <button
                        onClick={() => void downloadPayslip(r.id)}
                        className={secondaryButtonClass}
                      >
                        <FileText className="h-4 w-4" />
                        Payslip
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <EmptyRow colSpan={9}>
                  {loading
                    ? "Loading payroll…"
                    : "No payroll records generated yet."}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      {payment.id && (
        <Panel
          title="Record salary payment"
          description="This marks the payroll record paid and posts the disbursement to accounting."
        >
          <form
            onSubmit={payRow}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Field label="Payment date">
              <input
                className={inputClass}
                type="date"
                value={payment.payment_date}
                onChange={(e) =>
                  setPayment({ ...payment, payment_date: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Payment method">
              <select
                className={inputClass}
                value={payment.payment_method}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    payment_method: e.target.value as PaymentMethod,
                  })
                }
              >
                {methods.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Transaction reference">
              <input
                className={inputClass}
                value={payment.reference}
                onChange={(e) =>
                  setPayment({ ...payment, reference: e.target.value })
                }
                required
                minLength={2}
                placeholder="Bank / voucher reference"
              />
            </Field>
            <Field label="Paid from account">
              <select
                className={inputClass}
                value={payment.payment_account_id}
                onChange={(e) =>
                  setPayment({ ...payment, payment_account_id: e.target.value })
                }
                required
              >
                <option value="">Choose account</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} · {a.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex gap-2 lg:col-span-4">
              <button className={buttonClass} type="submit">
                Confirm payment
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => setPayment({ ...payment, id: "" })}
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}
    </FinanceLayout>
  );
}
