/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  FinanceService,
  type Expense,
  type ExpenseCategory,
  type FinanceAccount,
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
} from "@/components/finance/FinanceUI";
const methods: PaymentMethod[] = [
  "CASH",
  "BANK_TRANSFER",
  "POS",
  "CHEQUE",
  "OTHER",
];
export default function FinanceExpensesPage() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    payment_method: "BANK_TRANSFER" as PaymentMethod,
    expense_date: dateToday(),
    description: "",
    reference: "",
    payment_account_id: "",
  });
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [c, e, a] = await Promise.all([
        FinanceService.expenseCategories(),
        FinanceService.expenses(),
        FinanceService.accounts(),
      ]);
      setCategories(Array.isArray(c) ? c : []);
      setExpenses(Array.isArray(e) ? e : []);
      setAccounts(Array.isArray(a) ? a : []);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Unable to load expense records.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FinanceService.createExpenseCategory({ name: newCategory.trim() });
      toast.success("Expense category created.");
      setNewCategory("");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not create category.");
    }
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FinanceService.createExpense({
        ...form,
        amount: Number(form.amount),
        reference: form.reference || undefined,
      });
      toast.success("Expense recorded successfully.");
      setForm({ ...form, amount: "", description: "", reference: "" });
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not record expense.");
    }
  };
  const assetAccounts = accounts.filter(
    (a) => a.account_type === "ASSET" && a.is_active !== false,
  );
  return (
    <FinanceLayout>
      <PageHeading
        title="Expenses"
        description="Record operational costs and disbursements with a traceable accounting entry."
        action={
          <button onClick={load} className={secondaryButtonClass}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}
      <div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]">
        <Panel
          title="Expense categories"
          description="Create categories for school spending."
        >
          <form onSubmit={createCategory} className="flex gap-2">
            <input
              className={inputClass}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Utilities"
            />
            <button className={buttonClass} type="submit">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </form>
          <div className="mt-4 space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
              >
                <span>{c.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {c.id.slice(0, 8)}…
                </span>
              </div>
            ))}
            {!categories.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No categories yet.
              </p>
            )}
          </div>
        </Panel>
        <Panel
          title="Record expense"
          description="Enter what the school paid for and where the money came from. LERNA handles the accounting in the background."
        >
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
            <Field label="Expense category">
              <select
                className={inputClass}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                required
              >
                <option value="">Choose category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount (₦)">
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </Field>
            <Field label="Description">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                minLength={3}
                placeholder="What was purchased or paid for?"
              />
            </Field>
            <Field label="Expense date">
              <input
                className={inputClass}
                type="date"
                value={form.expense_date}
                onChange={(e) =>
                  setForm({ ...form, expense_date: e.target.value })
                }
                required
              />
            </Field>
            <Field label="Payment method">
              <select
                className={inputClass}
                value={form.payment_method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_method: e.target.value as PaymentMethod,
                  })
                }
              >
                {methods.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Reference (optional)">
              <input
                className={inputClass}
                value={form.reference}
                onChange={(e) =>
                  setForm({ ...form, reference: e.target.value })
                }
                placeholder="Transfer or receipt reference"
              />
            </Field>
            <Field label="Paid from account">
              <select
                className={inputClass}
                value={form.payment_account_id}
                onChange={(e) =>
                  setForm({ ...form, payment_account_id: e.target.value })
                }
                required
              >
                <option value="">Choose cash/bank account</option>
                {assetAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} · {a.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <button className={buttonClass} type="submit">
                <Plus className="h-4 w-4" />
                Record expense
              </button>
              {!assetAccounts.length && (
                <p className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                  No cash or bank account is available. Open Finance reports and
                  initialize the standard accounts first.
                </p>
              )}
            </div>
          </form>
        </Panel>
      </div>
      <Panel
        title="Expense register"
        description={`${expenses.length} records`}
      >
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr>
                <th className={thClass}>Date</th>
                <th className={thClass}>Description</th>
                <th className={thClass}>Category</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Reference</th>
                <th className={thClass}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((x) => (
                <tr key={x.id} className="border-t">
                  <td className={tdClass}>{x.expense_date}</td>
                  <td className={tdClass}>
                    <div className="font-medium">{x.description}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {x.id}
                    </div>
                  </td>
                  <td className={tdClass}>
                    {categories.find((c) => c.id === x.category_id)?.name ||
                      x.category_id}
                  </td>
                  <td className={tdClass}>
                    {x.payment_method.replaceAll("_", " ")}
                  </td>
                  <td className={tdClass}>{x.reference || "—"}</td>
                  <td className={tdClass + " font-semibold"}>
                    {money(x.amount)}
                  </td>
                </tr>
              ))}
              {!expenses.length && (
                <EmptyRow colSpan={6}>
                  {loading ? "Loading expenses…" : "No expenses recorded yet."}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </FinanceLayout>
  );
}
