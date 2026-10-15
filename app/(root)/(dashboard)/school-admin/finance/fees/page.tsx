/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  FinanceService,
  type FeeCategory,
  type StudentFee,
} from "@/app/services/finance.service";
import { SchoolAdminService } from "@/app/services/school-admin.service";
import {
  AcademicSetupService,
  type AcademicPeriodOption,
} from "@/app/services/academicSetup.service";
import {
  FinanceLayout,
  PageHeading,
  Panel,
  Field,
  inputClass,
  buttonClass,
  secondaryButtonClass,
  money,
  ErrorState,
  tableWrapClass,
  thClass,
  tdClass,
  EmptyRow,
} from "@/components/finance/FinanceUI";

type SchoolClass = { id: string; name: string; level?: string };
const standardCategories = [
  {
    name: "School Fees",
    description:
      "Main school fees charged each term to every enrolled student.",
  },
  {
    name: "Lesson Fee",
    description: "Lesson fees charged each term to every enrolled student.",
  },
  {
    name: "Textbooks",
    description: "Class-specific textbook charges and learning materials.",
  },
];
const normal = (value: string) => value.trim().toLowerCase();
const isCoreFee = (name: string) =>
  ["school fees", "school fee", "lesson fee", "lesson fees"].includes(
    normal(name),
  );

export default function FinanceFeesPage() {
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [sessions, setSessions] = useState<AcademicPeriodOption[]>([]);
  const [terms, setTerms] = useState<AcademicPeriodOption[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [scope, setScope] = useState<"ALL_STUDENTS" | "CLASS">("ALL_STUDENTS");
  const [classId, setClassId] = useState("");
  const [note, setNote] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingDefaults, setAddingDefaults] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<{
    category_name: string;
    created_count: number;
    invoice_count: number;
    skipped_count: number;
    students_found: number;
    amount_per_student: string;
    scope: string;
  } | null>(null);

  const selectedCategory = categories.find((item) => item.id === categoryId);
  const coreFee = Boolean(selectedCategory && isCoreFee(selectedCategory.name));
  const selectedSession = sessions.find((item) => item.id === sessionId);
  const selectedTerm = terms.find((item) => item.id === termId);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResponse, periodOptions, currentPeriod, classResponse] =
        await Promise.all([
          FinanceService.feeCategories(),
          AcademicSetupService.getAcademicPeriodOptions(),
          AcademicSetupService.getCurrentAcademicPeriod(),
          SchoolAdminService.getClasses(),
        ]);
      setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
      setSessions(periodOptions.sessions ?? []);
      setTerms(periodOptions.terms ?? []);
      const classList = Array.isArray(classResponse)
        ? classResponse
        : (classResponse?.classes ?? classResponse?.items ?? []);
      setClasses(Array.isArray(classList) ? classList : []);
      if (currentPeriod) {
        setSessionId((old) => old || currentPeriod.session_id);
        setTermId((old) => old || currentPeriod.term_id);
      }
      if (!currentPeriod && periodOptions.sessions?.length)
        setSessionId((old) => old || periodOptions.sessions[0].id);
      if (!currentPeriod && periodOptions.terms?.length)
        setTermId((old) => old || periodOptions.terms[0].id);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ||
          "We could not load the fee setup. Please refresh and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFees = useCallback(async () => {
    if (!sessionId || !termId) {
      setFees([]);
      return;
    }
    try {
      const result = await FinanceService.studentFees({
        session_id: sessionId,
        term_id: termId,
      });
      setFees(Array.isArray(result) ? result : []);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Could not load the fees for this term.",
      );
    }
  }, [sessionId, termId]);

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);
  useEffect(() => {
    void Promise.resolve().then(() => loadFees());
  }, [loadFees]);
  const summary = useMemo(() => {
    const grouped = new Map<
      string,
      { categoryId: string; count: number; total: number }
    >();
    for (const fee of fees) {
      const current = grouped.get(fee.fee_category_id) ?? {
        categoryId: fee.fee_category_id,
        count: 0,
        total: 0,
      };
      current.count += 1;
      current.total += Number(fee.amount_due || 0);
      grouped.set(fee.fee_category_id, current);
    }
    return Array.from(grouped.values()).map((item) => ({
      ...item,
      name:
        categories.find((c) => c.id === item.categoryId)?.name ?? "Other fee",
    }));
  }, [fees, categories]);

  async function addStandardCategories() {
    setAddingDefaults(true);
    try {
      let created = 0;
      for (const item of standardCategories) {
        if (
          categories.some(
            (category) => normal(category.name) === normal(item.name),
          )
        )
          continue;
        await FinanceService.createFeeCategory(item);
        created += 1;
      }
      toast.success(
        created
          ? `${created} standard fee types added.`
          : "Your standard fee types are already set up.",
      );
      await load();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Could not add the standard fee types.",
      );
    } finally {
      setAddingDefaults(false);
    }
  }

  async function createCategory(event: FormEvent) {
    event.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const created = await FinanceService.createFeeCategory({
        name: newCategory.trim(),
      });
      setCategories((old) => [...old, created]);
      setCategoryId(created.id);
      if (isCoreFee(created.name)) setScope("ALL_STUDENTS");
      else if (normal(created.name).includes("textbook")) setScope("CLASS");
      setNewCategory("");
      setShowAddCategory(false);
      toast.success("Fee type added.");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Could not add this fee type.");
    }
  }

  async function applyFee(event: FormEvent) {
    event.preventDefault();
    if (!sessionId || !termId) {
      toast.error("Choose an academic session and term first.");
      return;
    }
    if (!categoryId) {
      toast.error("Choose a fee type first.");
      return;
    }
    if (scope === "CLASS" && !classId) {
      toast.error("Choose the class that should receive this fee.");
      return;
    }
    setSaving(true);
    setLastResult(null);
    try {
      const result = await FinanceService.applyFeeSchedule({
        fee_category_id: categoryId,
        session_id: sessionId,
        term_id: termId,
        amount_due: Number(amount),
        scope: coreFee ? "ALL_STUDENTS" : scope,
        class_id: !coreFee && scope === "CLASS" ? classId : undefined,
        note: note.trim() || undefined,
      });
      setLastResult(result);
      toast.success(
        `Fee applied. ${result.created_count} student charge(s) and ${result.invoice_count} invoice(s) created.`,
      );
      setAmount("");
      setNote("");
      await loadFees();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail ||
          "Could not apply this fee. No changes should be made until the issue is resolved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <FinanceLayout>
      <PageHeading
        title="Set up term fees"
        description="Set each fee once. LERNA applies it to the right students for the selected term—no need to open student records one by one."
        action={
          <button
            onClick={() => {
              void load();
              void loadFees();
            }}
            className={secondaryButtonClass}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />
      {error && <ErrorState message={error} retry={load} />}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Selected academic session
          </p>
          <p className="mt-1 text-lg font-semibold">
            {selectedSession?.name ?? "Choose below"}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Selected term</p>
          <p className="mt-1 text-lg font-semibold">
            {selectedTerm?.name ?? "Choose below"}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Student charges for this term
          </p>
          <p className="mt-1 text-lg font-semibold">{fees.length}</p>
          <p className="text-xs text-muted-foreground">
            Existing fee assignments
          </p>
        </div>
      </div>

      <Panel
        title="Step 1 · Choose the term"
        description="Fees are kept separate for each academic session and term."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Academic session">
            <select
              className={inputClass}
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
            >
              <option value="">Choose session</option>
              {sessions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Term">
            <select
              className={inputClass}
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              required
            >
              <option value="">Choose term</option>
              {terms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
          You are setting charges for{" "}
          <strong>{selectedSession?.name ?? "the selected session"}</strong>,{" "}
          <strong>{selectedTerm?.name ?? "the selected term"}</strong> only.
          Changing the term lets you set a different amount for another term.
        </p>
      </Panel>

      <Panel
        title="Step 2 · Apply a fee"
        description="School fees and lesson fees go to every enrolled student. Other fees, such as textbooks, can be assigned to one class."
      >
        {standardCategories.some(
          (standard) =>
            !categories.some(
              (category) => normal(category.name) === normal(standard.name),
            ),
        ) && (
          <div className="mb-5 rounded-xl border border-dashed p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold">Start with the common fee types</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add School Fees, Lesson Fee and Textbooks. You can add other
                  types later.
                </p>
                <button
                  type="button"
                  onClick={addStandardCategories}
                  disabled={addingDefaults}
                  className={`${buttonClass} mt-3`}
                >
                  <Plus className="h-4 w-4" />
                  {addingDefaults ? "Setting up…" : "Add standard fee types"}
                </button>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={applyFee} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="What fee are you setting?">
              <select
                className={inputClass}
                value={categoryId}
                onChange={(e) => {
                  const nextCategoryId = e.target.value;
                  const nextCategory = categories.find(
                    (item) => item.id === nextCategoryId,
                  );
                  setCategoryId(nextCategoryId);
                  if (nextCategory && isCoreFee(nextCategory.name))
                    setScope("ALL_STUDENTS");
                  else if (
                    nextCategory &&
                    normal(nextCategory.name).includes("textbook")
                  )
                    setScope("CLASS");
                }}
                required
              >
                <option value="">Choose fee type</option>
                {categories
                  .filter((item) => item.is_active !== false)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Amount per student (₦)">
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 45000"
                required
              />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              Who should receive this fee?
            </p>
            {coreFee ? (
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <Users className="mt-0.5 h-5 w-5 text-blue-700 dark:text-blue-300" />
                <div>
                  <p className="font-semibold">Every enrolled student</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    School fees and lesson fees are applied to all students
                    enrolled in the selected session.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${scope === "ALL_STUDENTS" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : ""}`}
                >
                  <input
                    type="radio"
                    name="feeScope"
                    checked={scope === "ALL_STUDENTS"}
                    onChange={() => setScope("ALL_STUDENTS")}
                  />
                  <span>
                    <span className="block font-semibold">All students</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Use for a school-wide charge.
                    </span>
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${scope === "CLASS" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : ""}`}
                >
                  <input
                    type="radio"
                    name="feeScope"
                    checked={scope === "CLASS"}
                    onChange={() => setScope("CLASS")}
                  />
                  <span>
                    <span className="block font-semibold">One class</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Use for textbooks or class-specific items.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>
          {!coreFee && scope === "CLASS" && (
            <Field label="Class">
              <select
                className={inputClass}
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                <option value="">Choose class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.level ? ` · ${item.level.replaceAll("_", " ")}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Note for the school records (optional)">
            <input
              className={inputClass}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Required textbook package for Primary 4"
              maxLength={255}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={
                saving || loading || !sessionId || !termId || !categories.length
              }
              className={buttonClass}
            >
              <CheckCircle2 className="h-4 w-4" />
              {saving ? "Applying fee…" : "Apply fee to students"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddCategory((value) => !value)}
              className={secondaryButtonClass}
            >
              <Plus className="h-4 w-4" />
              Add another fee type
            </button>
          </div>
        </form>
        {showAddCategory && (
          <form
            onSubmit={createCategory}
            className="mt-4 flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row"
          >
            <input
              className={inputClass}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Sports levy"
              minLength={2}
              maxLength={100}
              required
            />
            <button className={buttonClass} type="submit">
              Save fee type
            </button>
          </form>
        )}
      </Panel>

      {lastResult && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-700 dark:text-emerald-300" />
            <div className="flex-1">
              <h3 className="font-semibold">
                {lastResult.category_name} applied
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {lastResult.created_count} new student charges and{" "}
                {lastResult.invoice_count} invoices created;{" "}
                {lastResult.skipped_count} existing charges left unchanged.
              </p>
              <p className="mt-2 text-sm">
                Amount per student:{" "}
                <strong>{money(lastResult.amount_per_student)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <Panel
        title="Step 3 · Review fees already set for this term"
        description="A simple summary by fee type. Existing charges are not duplicated if you apply the same fee again."
      >
        <div className={tableWrapClass}>
          <table className="w-full min-w-[560px]">
            <thead>
              <tr>
                <th className={thClass}>Fee type</th>
                <th className={thClass}>Students charged</th>
                <th className={thClass}>Total assigned</th>
                <th className={thClass}>Details</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item) => (
                <tr key={item.categoryId} className="border-t">
                  <td className={tdClass}>
                    <span className="font-semibold">{item.name}</span>
                  </td>
                  <td className={tdClass}>{item.count}</td>
                  <td className={tdClass + " font-semibold"}>
                    {money(item.total)}
                  </td>
                  <td className={tdClass}>
                    <span className="text-sm text-muted-foreground">
                      {item.count === 1
                        ? "1 student has"
                        : `${item.count} students have`}{" "}
                      this charge
                    </span>
                  </td>
                </tr>
              ))}
              {!summary.length && (
                <EmptyRow colSpan={4}>
                  {loading
                    ? "Loading term fees…"
                    : "No fees have been applied to this term yet. Use Step 2 above to get started."}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronRight className="h-4 w-4" />
          After setting fees, go to{" "}
          <Link
            className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
            href="/school-admin/finance/invoices"
          >
            Payments & receipts
          </Link>{" "}
          to record what parents pay.
        </div>
      </Panel>
    </FinanceLayout>
  );
}
