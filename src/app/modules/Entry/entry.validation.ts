import { z } from 'zod';

const createEntrySchema = z.object({
  body: z.object({
    entryNo: z.string().min(1, 'Entry number is required'),
    status: z.enum(['ACTIVE', 'PASSED_OUT']).optional().default('ACTIVE'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const updateEntrySchema = z.object({
  body: z.object({
    entryNo: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'PASSED_OUT']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const EntryValidation = {
  createEntrySchema,
  updateEntrySchema,
};
