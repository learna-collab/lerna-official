/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

const base = "/school-admin/finance";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "POS"
  | "CHEQUE"
  | "OTHER";
export type FinanceAccount = {
  id: string;
  code: string;
  name: string;
  account_type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  is_active?: boolean;
  is_system?: boolean;
  description?: string | null;
};
export type FeeCategory = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
};
export type StudentFee = {
  id: string;
  student_id: string;
  fee_category_id: string;
  session_id: string;
  term_id: string;
  amount_due: number | string;
  note?: string | null;
  created_at?: string;
};
export type Invoice = {
  id: string;
  school_id?: string;
  student_id: string;
  session_id: string;
  term_id: string;
  invoice_number: string;
  issue_date: string;
  due_date?: string | null;
  total_amount: number | string;
  amount_paid: number | string;
  balance_due: number | string;
  status: string;
  note?: string | null;
  created_at?: string;
  student_name?: string;
  admission_number?: string;
};
export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number | string;
  line_total: number | string;
  fee_category_id?: string | null;
};
export type InvoicePayment = {
  id: string;
  invoice_id: string;
  amount: number | string;
  payment_method: PaymentMethod;
  payment_date: string;
  reference: string;
  note?: string | null;
  journal_entry_id?: string | null;
};
export type ExpenseCategory = { id: string; name: string; is_active?: boolean };
export type Expense = {
  id: string;
  category_id: string;
  amount: number | string;
  payment_method: PaymentMethod;
  expense_date: string;
  description: string;
  reference?: string | null;
};
export type SalaryProfile = {
  id: string;
  employee_user_id: string;
  basic_salary: number | string;
  default_allowances: number | string;
  default_deductions: number | string;
  note?: string | null;
  is_active: boolean;
};
export type PayrollRecord = {
  id: string;
  employee_user_id: string;
  pay_year: number;
  pay_month: number;
  basic_salary: number | string;
  allowances: number | string;
  deductions: number | string;
  net_pay: number | string;
  status: string;
  payment_date?: string | null;
  payment_method?: PaymentMethod | null;
  reference?: string | null;
  note?: string | null;
};
export type JournalLine = {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string | null;
  debit: number | string;
  credit: number | string;
};
export type JournalEntry = {
  id: string;
  entry_number: string;
  entry_date: string;
  source_type: string;
  source_id?: string | null;
  description: string;
  status: string;
  lines: JournalLine[];
};
const data = async <T>(promise: Promise<{ data: T }>) => (await promise).data;

export const FinanceService = {
  dashboard: (params?: Record<string, string>) =>
    data<any>(api.get(`${base}/dashboard`, { params })),
  feeCategories: () => data<FeeCategory[]>(api.get(`${base}/fee-categories`)),
  createFeeCategory: (payload: { name: string; description?: string }) =>
    data<FeeCategory>(api.post(`${base}/fee-categories`, payload)),
  studentFees: (params?: Record<string, string>) =>
    data<StudentFee[]>(api.get(`${base}/student-fees`, { params })),
  assignStudentFee: (payload: {
    student_id: string;
    fee_category_id: string;
    session_id: string;
    term_id: string;
    amount_due: number;
    note?: string;
  }) => data<StudentFee>(api.post(`${base}/student-fees`, payload)),
  applyFeeSchedule: (payload: {
    fee_category_id: string;
    session_id: string;
    term_id: string;
    amount_due: number;
    scope: "ALL_STUDENTS" | "CLASS";
    class_id?: string;
    note?: string;
  }) =>
    data<{
      message: string;
      category_name: string;
      scope: string;
      students_found: number;
      created_count: number;
      invoice_count: number;
      skipped_count: number;
      amount_per_student: string;
      session_id: string;
      term_id: string;
    }>(api.post(`${base}/fee-schedules/apply`, payload)),
  invoices: (params?: Record<string, string>) =>
    data<Invoice[]>(api.get(`${base}/invoices`, { params })),
  invoice: (id: string) =>
    data<Invoice & { lines: InvoiceLine[]; payments: InvoicePayment[] }>(
      api.get(`${base}/invoices/${id}`),
    ),
  createInvoice: (payload: {
    student_id: string;
    session_id: string;
    term_id: string;
    invoice_number: string;
    issue_date: string;
    due_date?: string;
    lines: {
      description: string;
      quantity: number;
      unit_amount: number;
      fee_category_id?: string;
    }[];
    note?: string;
  }) => data<Invoice>(api.post(`${base}/invoices`, payload)),
  recordInvoicePayment: (
    id: string,
    payload: {
      amount: number;
      payment_method: PaymentMethod;
      payment_date: string;
      reference: string;
      receiving_account_id: string;
      note?: string;
    },
  ) => data<any>(api.post(`${base}/invoices/${id}/payments`, payload)),
  payments: (params?: Record<string, string>) =>
    data<InvoicePayment[]>(api.get(`${base}/payments`, { params })),
  expenseCategories: () =>
    data<ExpenseCategory[]>(api.get(`${base}/expense-categories`)),
  createExpenseCategory: (payload: { name: string }) =>
    data<ExpenseCategory>(api.post(`${base}/expense-categories`, payload)),
  expenses: (params?: Record<string, string>) =>
    data<Expense[]>(api.get(`${base}/expenses`, { params })),
  createExpense: (payload: {
    category_id: string;
    amount: number;
    payment_method: PaymentMethod;
    expense_date: string;
    description: string;
    reference?: string;
    payment_account_id: string;
    expense_account_id?: string;
  }) => data<Expense>(api.post(`${base}/expenses`, payload)),
  salaryProfiles: () =>
    data<SalaryProfile[]>(api.get(`${base}/salary-profiles`)),
  createSalaryProfile: (payload: {
    employee_user_id: string;
    basic_salary: number;
    default_allowances: number;
    default_deductions: number;
    note?: string;
  }) => data<SalaryProfile>(api.post(`${base}/salary-profiles`, payload)),
  generatePayroll: (payload: {
    employee_user_id: string;
    pay_year: number;
    pay_month: number;
    basic_salary: number;
    allowances: number;
    deductions: number;
    note?: string;
  }) => data<PayrollRecord>(api.post(`${base}/payroll/generate`, payload)),
  generatePayrollFromProfile: (
    employee_user_id: string,
    pay_year: number,
    pay_month: number,
  ) =>
    data<PayrollRecord>(
      api.post(`${base}/payroll/generate-from-profile`, null, {
        params: { employee_user_id, pay_year, pay_month },
      }),
    ),
  payroll: (params?: Record<string, string>) =>
    data<PayrollRecord[]>(api.get(`${base}/payroll`, { params })),
  payPayroll: (
    id: string,
    payload: {
      payment_date: string;
      payment_method: PaymentMethod;
      reference: string;
      payment_account_id: string;
    },
  ) => data<PayrollRecord>(api.post(`${base}/payroll/${id}/pay`, payload)),
  payslip: (id: string) => data<any>(api.get(`${base}/payroll/${id}/payslip`)),
  accounts: () => data<FinanceAccount[]>(api.get(`${base}/accounts`)),
  initializeAccounts: () => data<any>(api.post(`${base}/accounts/initialize`)),
  createAccount: (payload: {
    code: string;
    name: string;
    account_type: FinanceAccount["account_type"];
    description?: string;
  }) => data<FinanceAccount>(api.post(`${base}/accounts`, payload)),
  ledger: (params?: Record<string, string>) =>
    data<{ entry: JournalEntry; lines: JournalLine[] }[]>(
      api.get(`${base}/ledger`, { params }),
    ),
  trialBalance: (params?: Record<string, string>) =>
    data<any>(api.get(`${base}/reports/trial-balance`, { params })),
  reconciliation: (params?: Record<string, string>) =>
    data<any>(api.get(`${base}/reports/reconciliation`, { params })),
};
