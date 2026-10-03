import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import AppError from '../../errors/AppError';
import { getDhakaDateString } from '../../utils/dhakaDate';
import { toPaisa, toTaka } from '../../utils/money';
import { PStaffModel } from '../PStaff/pStaff.model';
import { TPaymentInput } from './payment.interface';
import { PaymentModel } from './payment.model';

const resolveStaffId = async (input: string): Promise<string> => {
  if (isValidObjectId(input)) {
    const existing = await PStaffModel.findById(input);
    if (existing) return existing.id;
  }
  const byBdNo = await PStaffModel.findOne({
    bdNo: input.trim().toUpperCase(),
  });
  if (byBdNo) return byBdNo.id;

  throw new AppError(StatusCodes.NOT_FOUND, 'P-Staff member not found');
};

const recordPayment = async (payload: TPaymentInput, userId?: string) => {
  const paisaAmount = toPaisa(payload.amount);
  if (paisaAmount <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Payment amount must be greater than zero',
    );
  }

  const paidOn = payload.paidOn || getDhakaDateString();

  let staffId: string | undefined;
  if (payload.customerType === 'P_STAFF') {
    if (!payload.pstaff) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'P-Staff identification required',
      );
    }
    staffId = await resolveStaffId(payload.pstaff);
  }

  const paymentDoc = await PaymentModel.create({
    customerType: payload.customerType,
    entry: payload.entry?.trim(),
    squadron: payload.squadron,
    room: payload.room,
    pstaff: staffId,
    year: payload.year,
    month: payload.month,
    amount: paisaAmount,
    paidOn,
    paymentMethod: payload.paymentMethod || 'CASH',
    trxId: payload.trxId?.trim(),
    remarks: payload.remarks?.trim(),
    receivedBy: userId,
  });

  const populated = await PaymentModel.findById(paymentDoc.id)
    .populate('pstaff')
    .populate('receivedBy', 'name rank bdNo role');

  if (!populated) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to record payment',
    );
  }

  return {
    ...populated.toObject(),
    amountInTaka: toTaka(populated.amount),
  };
};

const getPayments = async (query: {
  customerType?: string;
  entry?: string;
  squadron?: string;
  room?: string;
  pstaff?: string;
  year?: string | number;
  month?: string | number;
}) => {
  const filter: Record<string, unknown> = {};

  if (query.customerType) filter.customerType = query.customerType;
  if (query.entry) filter.entry = query.entry;
  if (query.squadron) filter.squadron = query.squadron;
  if (query.room) filter.room = query.room;
  if (query.year) filter.year = Number(query.year);
  if (query.month) filter.month = Number(query.month);

  if (query.pstaff) {
    filter.pstaff = await resolveStaffId(query.pstaff);
  }

  const records = await PaymentModel.find(filter)
    .populate('pstaff')
    .populate('receivedBy', 'name rank bdNo role')
    .sort({ paidOn: -1, createdAt: -1 });

  return records.map((r) => ({
    ...r.toObject(),
    amountInTaka: toTaka(r.amount),
  }));
};

const deletePayment = async (id: string) => {
  const payment = await PaymentModel.findByIdAndDelete(id);
  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payment record not found');
  }
  return payment;
};

export const PaymentService = {
  recordPayment,
  getPayments,
  deletePayment,
};
