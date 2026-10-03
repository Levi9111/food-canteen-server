import { Schema, model } from 'mongoose';
import { IOffice } from './office.interface';

const officeSchema = new Schema<IOffice>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const OfficeModel = model<IOffice>('Office', officeSchema);
