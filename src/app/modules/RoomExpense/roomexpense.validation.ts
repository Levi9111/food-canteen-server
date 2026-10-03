import { z } from 'zod';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const upsertRoomExpenseSchema = z.object({
  body: z.object({
    entry: z.string().min(1, 'Entry is required'),
    squadron: z.enum(CANTEEN_CONSTANTS.squadrons),
    room: z.enum(CANTEEN_CONSTANTS.rooms),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    amount: z.number().min(0, 'Amount must be non-negative'),
    representativeName: z.string().optional(),
    itemsDescription: z.string().optional(),
  }),
});

const bulkUpsertRoomExpenseSchema = z.object({
  body: z.object({
    expenses: z.array(upsertRoomExpenseSchema.shape.body),
  }),
});

const queryRoomExpenseSchema = z.object({
  query: z.object({
    entry: z.string().optional(),
    squadron: z.enum(CANTEEN_CONSTANTS.squadrons).optional(),
    room: z.enum(CANTEEN_CONSTANTS.rooms).optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const RoomExpenseValidation = {
  upsertRoomExpenseSchema,
  bulkUpsertRoomExpenseSchema,
  queryRoomExpenseSchema,
};
