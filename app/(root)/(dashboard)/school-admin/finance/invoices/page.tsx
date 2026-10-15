/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Banknote,
  RefreshCw,
  ReceiptText,
  Search,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FinanceService,
  type FinanceAccount,
  type Invoice,
  type InvoicePayment,
  type InvoiceLine,
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

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "POS", label: "POS" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

type InvoiceRow = Invoice & {
  student_name?: string;
  admission_number?: string;
};
type InvoiceDetails = InvoiceRow & {
  lines: InvoiceLine[];
  payments?: InvoicePayment[];
};
type StudentTermGroup = {
  key: string;
  student_id: string;
  student_name: string;
  admission_number?: string;
  session_id: string;
  term_id: string;
  invoices: InvoiceRow[];
  total_amount: number;
  amount_paid: number;
  balance_due: number;
};

const amountDue = (invoice: InvoiceRow) =>
  Math.max(
    0,
    Number(
      invoice.balance_due ??
        Number(invoice.total_amount) - Number(invoice.amount_paid),
    ),
  );

export default function FinanceInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showPaid, setShowPaid] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudentTermGroup | null>(
    null,
  );
  const [groupDetails, setGroupDetails] = useState<InvoiceDetails[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [pay, setPay] = useState({
    amount: "",
    payment_method: "CASH" as PaymentMethod,
    payment_date: dateToday(),
    reference: "",
    receiving_account_id: "",
    note: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [invoiceRows, paymentRows, accountRows] = await Promise.all([
        FinanceService.invoices(),
        FinanceService.payments(),
        FinanceService.accounts(),
      ]);
      setInvoices(
        Array.isArray(invoiceRows) ? (invoiceRows as InvoiceRow[]) : [],
      );
      setPayments(Array.isArray(paymentRows) ? paymentRows : []);
      const usableAccounts = Array.isArray(accountRows)
        ? accountRows.filter(
            (item) => item.account_type === "ASSET" && item.is_active !== false,
          )
        : [];
      setAccounts(usableAccounts);
      setPay((old) => ({
        ...old,
        receiving_account_id:
          old.receiving_account_id || usableAccounts[0]?.id || "",
      }));
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "We could not load payments. Please refresh and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  // Show one row per student and academic term, even if older data contains one invoice per fee.
  const studentTermGroups = useMemo<StudentTermGroup[]>(() => {
    const grouped = new Map<string, StudentTermGroup>();
    for (const invoice of invoices) {
      const key = `${invoice.student_id}:${invoice.session_id}:${invoice.term_id}`;
      let group = grouped.get(key);
      if (!group) {
        group = {
          key,
          student_id: invoice.student_id,
          student_name: invoice.student_name || "Student",
          admission_number: invoice.admission_number,
          session_id: invoice.session_id,
          term_id: invoice.term_id,
          invoices: [],
          total_amount: 0,
          amount_paid: 0,
          balance_due: 0,
        };
        grouped.set(key, group);
      }
      group.invoices.push(invoice);
      group.total_amount += Number(invoice.total_amount || 0);
      group.amount_paid += Number(invoice.amount_paid || 0);
      group.balance_due += amountDue(invoice);
    }
    return Array.from(grouped.values()).sort((a, b) =>
      a.student_name.localeCompare(b.student_name),
    );
  }, [invoices]);

  const visibleGroups = useMemo(
    () =>
      studentTermGroups.filter((group) => {
        if (!showPaid && group.balance_due <= 0) return false;
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return [
          group.student_name,
          group.admission_number,
          ...group.invoices.map((invoice) => invoice.invoice_number),
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );
      }),
    [studentTermGroups, search, showPaid],
  );

  const outstandingTotal = studentTermGroups.reduce(
    (sum, group) => sum + group.balance_due,
    0,
  );
  const selectedInvoice = groupDetails.find(
    (item) => item.id === selectedInvoiceId,
  );

  async function openStudentFees(group: StudentTermGroup) {
    setSelectedGroup(group);
    setCollectOpen(true);
    setDetailsLoading(true);
    setGroupDetails([]);
    setSelectedInvoiceId("");
    try {
      const details = await Promise.all(
        group.invoices.map(
          (invoice) =>
            FinanceService.invoice(invoice.id) as Promise<InvoiceDetails>,
        ),
      );
      const sorted = details.sort((a, b) =>
        String(a.lines?.[0]?.description || a.invoice_number).localeCompare(
          String(b.lines?.[0]?.description || b.invoice_number),
        ),
      );
      setGroupDetails(sorted);
      const firstOutstanding = sorted.find((item) => amountDue(item) > 0);
      if (firstOutstanding) {
        setSelectedInvoiceId(firstOutstanding.id);
        setPay((old) => ({
          ...old,
          amount: String(amountDue(firstOutstanding)),
          receiving_account_id:
            old.receiving_account_id || accounts[0]?.id || "",
        }));
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail ||
          "Could not load the student's fee details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function changeSelectedInvoice(invoiceId: string) {
    setSelectedInvoiceId(invoiceId);
    const invoice = groupDetails.find((item) => item.id === invoiceId);
    setPay((old) => ({
      ...old,
      amount: invoice ? String(amountDue(invoice)) : "",
    }));
  }

  async function recordPayment(event: FormEvent) {
    event.preventDefault();
    if (!selectedInvoice) {
      toast.error("Choose a fee item to record this payment against.");
      return;
    }
    if (!pay.receiving_account_id) {
      toast.error(
        "No cash or bank account is available yet. Refresh or ask your system administrator for help.",
      );
      return;
    }
    const amount = Number(pay.amount);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > amountDue(selectedInvoice)
    ) {
      toast.error(
        "Enter an amount greater than zero and no more than the balance for the selected fee.",
      );
      return;
    }
    setSaving(true);
    try {
      await FinanceService.recordInvoicePayment(selectedInvoice.id, {
        amount,
        payment_method: pay.payment_method,
        payment_date: pay.payment_date,
        reference: pay.reference.trim(),
        receiving_account_id: pay.receiving_account_id,
        note: pay.note.trim() || undefined,
      });
      toast.success(
        "Payment recorded. The student's fee totals have been updated.",
      );
      setPay((old) => ({ ...old, amount: "", reference: "", note: "" }));
      await load();
      setCollectOpen(false);
      setSelectedGroup(null);
      setGroupDetails([]);
      setSelectedInvoiceId("");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Could not record this payment.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <FinanceLayout>
      <PageHeading
        title="Payments & receipts"
        description="Each student appears once per term. Open a student's record to see every fee, the combined total, payments received, and the remaining balance."
        action={
          <button onClick={load} className={secondaryButtonClass}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Student term records</p>
          <p className="mt-1 text-2xl font-bold">{studentTermGroups.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Students still owing</p>
          <p className="mt-1 text-2xl font-bold">
            {studentTermGroups.filter((group) => group.balance_due > 0).length}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total outstanding</p>
          <p className="mt-1 text-2xl font-bold">{money(outstandingTotal)}</p>
        </div>
      </div>

      <Panel
        title="Student fee records"
        description="One record combines all fees for a student in the same term. Select View fees / Collect to see each fee and record a payment."
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={`${inputClass} pl-9`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, admission number or invoice number"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPaid}
              onChange={(e) => setShowPaid(e.target.checked)}
            />
            Include fully paid students
          </label>
        </div>
        <div className={tableWrapClass}>
          <table className="w-full min-w-[820px]">
            <thead>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Fees in term</th>
                <th className={thClass}>Total fees</th>
                <th className={thClass}>Total paid</th>
                <th className={thClass}>Balance</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleGroups.map((group) => (
                <tr key={group.key} className="border-t">
                  <td className={tdClass}>
                    <div className="font-semibold">{group.student_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {group.admission_number
                        ? `Admission no. ${group.admission_number}`
                        : "Student fee record"}
                    </div>
                  </td>
                  <td className={tdClass}>
                    <div className="font-medium">
                      {group.invoices.length}{" "}
                      {group.invoices.length === 1
                        ? "fee record"
                        : "fee records"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      All fees for this term
                    </div>
                  </td>
                  <td className={tdClass}>{money(group.total_amount)}</td>
                  <td className={tdClass}>{money(group.amount_paid)}</td>
                  <td className={tdClass + " font-semibold"}>
                    {money(group.balance_due)}
                  </td>
                  <td className={tdClass}>
                    <StatusPill
                      value={
                        group.balance_due <= 0
                          ? "PAID"
                          : group.amount_paid > 0
                            ? "PART_PAID"
                            : "ISSUED"
                      }
                    />
                  </td>
                  <td className={tdClass}>
                    <button
                      onClick={() => void openStudentFees(group)}
                      className={secondaryButtonClass}
                    >
                      <ReceiptText className="h-4 w-4" />
                      View fees / Collect
                    </button>
                  </td>
                </tr>
              ))}
              {!visibleGroups.length && (
                <EmptyRow colSpan={7}>
                  {loading
                    ? "Loading student fee records…"
                    : "No student fee records match this search. Set up term fees first if you have not done so yet."}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Recent receipts"
        description="Each receipt is an actual payment transaction. These records remain separate so the school can trace each cash, bank transfer or POS payment. "
      >
        <div className={tableWrapClass}>
          <table className="w-full min-w-[650px]">
            <thead>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Receipt / reference</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Amount received</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((payment) => {
                const invoice = invoices.find(
                  (item) => item.id === payment.invoice_id,
                );
                return (
                  <tr key={payment.id} className="border-t">
                    <td className={tdClass}>
                      <div className="font-semibold">
                        {invoice?.student_name || "Student"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {invoice?.invoice_number || "Student payment"}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="font-semibold">{payment.reference}</div>
                      <div className="text-xs text-muted-foreground">
                        Payment receipt
                      </div>
                    </td>
                    <td className={tdClass}>{payment.payment_date}</td>
                    <td className={tdClass}>
                      {methods.find(
                        (method) => method.value === payment.payment_method,
                      )?.label || payment.payment_method}
                    </td>
                    <td className={tdClass + " font-semibold"}>
                      {money(payment.amount)}
                    </td>
                  </tr>
                );
              })}
              {!payments.length && (
                <EmptyRow colSpan={5}>
                  No payments have been recorded yet.
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <ReceiptText className="mt-0.5 h-4 w-4 shrink-0" />
          Student fee totals are combined above. Individual receipt transactions
          remain available here for auditing and reference tracking.
        </div>
      </Panel>

      <Dialog
        open={collectOpen}
        onOpenChange={(open) => {
          setCollectOpen(open);
          if (!open) {
            setSelectedGroup(null);
            setGroupDetails([]);
            setSelectedInvoiceId("");
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup?.student_name || "Student fee details"}
            </DialogTitle>
            <DialogDescription>
              All fee items and the combined term balance for this student.
              Choose the fee to which this payment should be applied.
            </DialogDescription>
          </DialogHeader>
          {selectedGroup && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total fees</p>
                <p className="mt-1 font-semibold">
                  {money(selectedGroup.total_amount)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total paid</p>
                <p className="mt-1 font-semibold">
                  {money(selectedGroup.amount_paid)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="mt-1 font-semibold">
                  {money(selectedGroup.balance_due)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Fee items</p>
                <p className="mt-1 font-semibold">
                  {selectedGroup.invoices.length}
                </p>
              </div>
            </div>
          )}

          <div className="mt-2">
            <h3 className="mb-2 text-sm font-semibold">
              Individual fee details
            </h3>
            {detailsLoading ? (
              <div className="flex items-center gap-2 rounded-lg border p-5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading this student&apos;s fee details…
              </div>
            ) : (
              <div className={tableWrapClass}>
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr>
                      <th className={thClass}>Fee</th>
                      <th className={thClass}>Invoice</th>
                      <th className={thClass}>Amount</th>
                      <th className={thClass}>Paid</th>
                      <th className={thClass}>Balance</th>
                      <th className={thClass}>Collect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupDetails.flatMap((invoice) =>
                      (invoice.lines?.length
                        ? invoice.lines
                        : [
                            {
                              id: invoice.id,
                              description: "Student fee",
                              quantity: 1,
                              unit_amount: invoice.total_amount,
                              line_total: invoice.total_amount,
                            } as InvoiceLine,
                          ]
                      ).map((line, index) => (
                        <tr
                          key={`${invoice.id}:${line.id}:${index}`}
                          className={`border-t ${selectedInvoiceId === invoice.id ? "bg-blue-50/70 dark:bg-blue-950/20" : ""}`}
                        >
                          <td className={tdClass}>
                            <div className="font-medium">
                              {line.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {invoice.status}
                            </div>
                          </td>
                          <td className={tdClass}>{invoice.invoice_number}</td>
                          <td className={tdClass}>{money(line.line_total)}</td>
                          <td className={tdClass}>
                            {index === 0 ? (
                              money(invoice.amount_paid)
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className={tdClass + " font-semibold"}>
                            {index === 0 ? (
                              money(amountDue(invoice))
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className={tdClass}>
                            <button
                              type="button"
                              disabled={amountDue(invoice) <= 0}
                              onClick={() => changeSelectedInvoice(invoice.id)}
                              className={
                                selectedInvoiceId === invoice.id
                                  ? buttonClass
                                  : secondaryButtonClass
                              }
                            >
                              {selectedInvoiceId === invoice.id
                                ? "Selected"
                                : "Choose"}
                            </button>
                          </td>
                        </tr>
                      )),
                    )}
                    {!groupDetails.length && !detailsLoading && (
                      <EmptyRow colSpan={6}>
                        No fee details are available for this student.
                      </EmptyRow>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <form onSubmit={recordPayment} className="mt-3 space-y-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm font-semibold">Record a payment</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedInvoice
                  ? `Selected: ${selectedInvoice.lines?.map((line) => line.description).join(", ") || selectedInvoice.invoice_number} · Remaining on this fee: ${money(amountDue(selectedInvoice))}`
                  : "Choose a fee with an outstanding balance above."}
              </p>
            </div>
            <Field label="Amount received (₦)">
              <input
                className={inputClass}
                type="number"
                min="0.01"
                max={selectedInvoice ? amountDue(selectedInvoice) : undefined}
                step="0.01"
                value={pay.amount}
                onChange={(e) => setPay({ ...pay, amount: e.target.value })}
                placeholder="Enter amount received"
                required
                disabled={!selectedInvoice || detailsLoading}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment method">
                <select
                  className={inputClass}
                  value={pay.payment_method}
                  onChange={(e) =>
                    setPay({
                      ...pay,
                      payment_method: e.target.value as PaymentMethod,
                    })
                  }
                  disabled={!selectedInvoice}
                >
                  {methods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date received">
                <input
                  className={inputClass}
                  type="date"
                  value={pay.payment_date}
                  onChange={(e) =>
                    setPay({ ...pay, payment_date: e.target.value })
                  }
                  required
                  disabled={!selectedInvoice}
                />
              </Field>
            </div>
            <Field label="Receipt number or bank reference">
              <input
                className={inputClass}
                value={pay.reference}
                onChange={(e) => setPay({ ...pay, reference: e.target.value })}
                placeholder="e.g. RCPT-001 or bank transfer reference"
                minLength={2}
                required
                disabled={!selectedInvoice}
              />
            </Field>
            <Field label="Money received into">
              <select
                className={inputClass}
                value={pay.receiving_account_id}
                onChange={(e) =>
                  setPay({ ...pay, receiving_account_id: e.target.value })
                }
                required
                disabled={!selectedInvoice}
              >
                <option value="">Choose cash or bank account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Note (optional)">
              <input
                className={inputClass}
                value={pay.note}
                onChange={(e) => setPay({ ...pay, note: e.target.value })}
                placeholder="Optional payment note"
                disabled={!selectedInvoice}
              />
            </Field>
            {!accounts.length && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                No cash or bank account is set up yet. Refresh the page or ask
                your system administrator for help.
              </p>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => setCollectOpen(false)}
                className={secondaryButtonClass}
              >
                <X className="h-4 w-4" />
                Close
              </button>
              <button
                className={buttonClass}
                type="submit"
                disabled={
                  !selectedInvoice ||
                  saving ||
                  detailsLoading ||
                  !accounts.length
                }
              >
                <Banknote className="h-4 w-4" />
                {saving ? "Saving payment…" : "Save payment"}
              </button>
            </DialogFooter>
            <p className="text-xs text-muted-foreground">
              The selected fee balance and the combined student total update
              automatically after saving.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </FinanceLayout>
  );
}
