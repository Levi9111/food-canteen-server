import { Schema, model } from 'mongoose';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';
import { IRoomExpense } from './roomExpense.interface';

const roomExpenseSchema = new Schema<IRoomExpense>(
  {
    entry: {
      type: String,
      required: true,
      trim: true,
    },
    squadron: {
      type: String,
      enum: CANTEEN_CONSTANTS.squadrons,
      required: true,
    },
    room: {
      type: String,
      enum: CANTEEN_CONSTANTS.rooms,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    representativeName: {
      type: String,
      trim: true,
    },
    itemsDescription: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Compound index guaranteeing one expense record per room per day per entry
roomExpenseSchema.index(
  { entry: 1, squadron: 1, room: 1, date: 1 },
  { unique: true },
);

// Monthly reporting indexes
roomExpenseSchema.index({ entry: 1, squadron: 1, year: 1, month: 1 });
roomExpenseSchema.index({ entry: 1, date: 1 });

export const RoomExpenseModel = model<IRoomExpense>(
  'RoomExpense',
  roomExpenseSchema,
);
