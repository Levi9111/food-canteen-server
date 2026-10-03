import { z } from 'zod';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const closeMonthSchema = z.object({
  body: z.object({
    customerType: z.enum(CANTEEN_CONSTANTS.customerTypes),
    entry: z.string().optional(),
    year: z.number().int().min(2020),
    month: z.number().int().min(1).max(12),
  }),
});

const queryClosingSchema = z.object({
  query: z.object({
    customerType: z.enum(CANTEEN_CONSTANTS.customerTypes).optional(),
    entry: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const ClosingValidation = {
  closeMonthSchema,
  queryClosingSchema,
};
