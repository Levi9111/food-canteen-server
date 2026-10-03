import { z } from 'zod';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const createPStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    rank: z.enum(CANTEEN_CONSTANTS.ranks),
    bdNo: z.string().min(2, 'BD Number is required'),
    office: z.string().min(1, 'Office is required'),
    phone: z.string().optional(),
    openingDue: z.number().min(0).optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

const updatePStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    rank: z.enum(CANTEEN_CONSTANTS.ranks).optional(),
    bdNo: z.string().min(2).optional(),
    office: z.string().optional(),
    phone: z.string().optional(),
    openingDue: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const PStaffValidation = {
  createPStaffSchema,
  updatePStaffSchema,
};
