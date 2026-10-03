import { z } from 'zod';

const createOfficeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Office name must be at least 2 characters'),
    sortOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateOfficeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const OfficeValidation = {
  createOfficeSchema,
  updateOfficeSchema,
};
