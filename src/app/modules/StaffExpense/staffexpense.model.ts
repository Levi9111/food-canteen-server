import { Schema, model } from 'mongoose';
import { IStaffExpense } from './staffexpense.interface';

const staffExpenseSchema = new Schema<IStaffExpense>(
  {
    pstaff: {
      type: Schema.Types.ObjectId,
      ref: 'PStaff',
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
    particulars: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

staffExpenseSchema.index({ pstaff: 1, date: 1 }, { unique: true });
staffExpenseSchema.index({ year: 1, month: 1 });
staffExpenseSchema.index({ date: 1 });

export const StaffExpenseModel = model<IStaffExpense>(
  'StaffExpense',
  staffExpenseSchema,
);
