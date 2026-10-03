import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';
import { IPStaff } from './pstaff.interface';

const pStaffSchema = new Schema<IPStaff>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      enum: CANTEEN_CONSTANTS.ranks,
      required: true,
    },
    bdNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    office: {
      type: Schema.Types.ObjectId,
      ref: 'Office',
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    openingDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    accessKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

pStaffSchema.pre('save', function () {
  if (!this.accessKey) {
    this.accessKey = crypto.randomBytes(8).toString('hex');
  }
});

pStaffSchema.index({ name: 'text', bdNo: 'text' });
pStaffSchema.index({ office: 1, isActive: 1 });

export const PStaffModel = model<IPStaff>('PStaff', pStaffSchema);
