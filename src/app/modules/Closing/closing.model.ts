import { Schema, model } from 'mongoose';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';
import { IMonthlyClosing } from './closing.interface';

const monthlyClosingSchema = new Schema<IMonthlyClosing>(
  {
    customerType: {
      type: String,
      enum: CANTEEN_CONSTANTS.customerTypes,
      required: true,
    },
    entry: {
      type: String,
      trim: true,
    },
    squadron: {
      type: String,
      enum: CANTEEN_CONSTANTS.squadrons,
    },
    room: {
      type: String,
      enum: CANTEEN_CONSTANTS.rooms,
    },
    pstaff: {
      type: Schema.Types.ObjectId,
      ref: 'PStaff',
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    previousDue: {
      type: Number,
      default: 0,
    },
    monthlyConsumption: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
    netDue: {
      type: Number,
      required: true,
    },
    activeDaysCount: {
      type: Number,
      default: 0,
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    closedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

monthlyClosingSchema.index(
  { customerType: 1, entry: 1, squadron: 1, room: 1, year: 1, month: 1 },
  { unique: true, sparse: true },
);

monthlyClosingSchema.index(
  { customerType: 1, pstaff: 1, year: 1, month: 1 },
  { unique: true, sparse: true },
);

export const MonthlyClosingModel = model<IMonthlyClosing>(
  'MonthlyClosing',
  monthlyClosingSchema,
);
