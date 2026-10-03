import { Schema, model } from 'mongoose';
import { IEntry } from './entry.interface';

const entrySchema = new Schema<IEntry>(
  {
    entryNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PASSED_OUT'],
      default: 'ACTIVE',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const EntryModel = model<IEntry>('Entry', entrySchema);
