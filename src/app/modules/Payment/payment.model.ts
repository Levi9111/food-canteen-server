import { Schema, model } from 'mongoose';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
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
      trim: true,
    },
    room: {
      type: String,
      trim: true,
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
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paidOn: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    paymentMethod: {
      type: String,
      enum: CANTEEN_CONSTANTS.paymentMethods,
      default: 'CASH',
    },
    trxId: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

paymentSchema.index({ customerType: 1, pstaff: 1, year: 1, month: 1 });
paymentSchema.index({
  customerType: 1,
  entry: 1,
  squadron: 1,
  room: 1,
  year: 1,
  month: 1,
});
paymentSchema.index({ paidOn: 1 });

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
