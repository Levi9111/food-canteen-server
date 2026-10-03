import { z } from 'zod';

const upsertStaffExpenseSchema = z.object({
  body: z.object({
    pstaff: z.string().min(1, 'P-Staff ID or BD number is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    amount: z.number().min(0, 'Amount must be non-negative'),
    particulars: z.string().optional(),
  }),
});

const bulkUpsertStaffExpenseSchema = z.object({
  body: z.object({
    expenses: z.array(upsertStaffExpenseSchema.shape.body),
  }),
});

const queryStaffExpenseSchema = z.object({
  query: z.object({
    pstaff: z.string().optional(),
    office: z.string().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const StaffExpenseValidation = {
  upsertStaffExpenseSchema,
  bulkUpsertStaffExpenseSchema,
  queryStaffExpenseSchema,
};
