import { z } from 'zod';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const createPaymentSchema = z
  .object({
    body: z.object({
      customerType: z.enum(CANTEEN_CONSTANTS.customerTypes),
      entry: z.string().optional(),
      squadron: z.string().optional(),
      room: z.string().optional(),
      pstaff: z.string().optional(),
      year: z.number().int().min(2020),
      month: z.number().int().min(1).max(12),
      amount: z.number().positive('Payment amount must be greater than zero'),
      paidOn: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      paymentMethod: z
        .enum(CANTEEN_CONSTANTS.paymentMethods)
        .optional()
        .default('CASH'),
      trxId: z.string().optional(),
      remarks: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.body.customerType === 'RECRUIT_ROOM') {
        return !!data.body.entry && !!data.body.squadron && !!data.body.room;
      }
      if (data.body.customerType === 'P_STAFF') {
        return !!data.body.pstaff;
      }
      return true;
    },
    {
      message:
        'Recruit payments require entry, squadron, and room; P-Staff payments require pstaff ID or BD Number.',
    },
  );

const queryPaymentSchema = z.object({
  query: z.object({
    customerType: z.enum(CANTEEN_CONSTANTS.customerTypes).optional(),
    entry: z.string().optional(),
    squadron: z.string().optional(),
    room: z.string().optional(),
    pstaff: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const PaymentValidation = {
  createPaymentSchema,
  queryPaymentSchema,
};
