import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import AppError from '../../errors/AppError';
import { parseDateParts } from '../../utils/dhakaDate';
import { toPaisa, toTaka } from '../../utils/money';
import { PStaffModel } from '../PStaff/pStaff.model';
import { TStaffExpenseInput } from './staffExpense.interface';
import { StaffExpenseModel } from './staffExpense.model';

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

const upsertStaffExpense = async (
  payload: TStaffExpenseInput,
  userId?: string,
) => {
  const staffId = await resolveStaffId(payload.pstaff);
  const { year, month, day } = parseDateParts(payload.date);
  const paisaAmount = toPaisa(payload.amount);

  const filter = {
    pstaff: staffId,
    date: payload.date,
  };

  if (paisaAmount <= 0) {
    await StaffExpenseModel.findOneAndDelete(filter);
    return {
      deleted: true,
      message: 'Staff expense cleared for the date',
    };
  }

  const update = {
    $set: {
      amount: paisaAmount,
      year,
      month,
      day,
      particulars: payload.particulars || '',
      updatedBy: userId,
      isDeleted: false,
    },
    $setOnInsert: {
      recordedBy: userId,
    },
  };

  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  };

  const result = await StaffExpenseModel.findOneAndUpdate(
    filter,
    update,
    options,
  ).populate({
    path: 'pstaff',
    populate: { path: 'office' },
  });

  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to record staff expense',
    );
  }

  return {
    ...result.toObject(),
    amountInTaka: toTaka(result.amount),
  };
};

const bulkUpsertStaffExpenses = async (
  expenses: TStaffExpenseInput[],
  userId?: string,
) => {
  const results = [];
  for (const exp of expenses) {
    const res = await upsertStaffExpense(exp, userId);
    results.push(res);
  }
  return results;
};

const getStaffExpenses = async (query: {
  pstaff?: string;
  office?: string;
  date?: string;
  year?: string | number;
  month?: string | number;
}) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.pstaff) {
    filter.pstaff = await resolveStaffId(query.pstaff);
  }
  if (query.date) filter.date = query.date;
  if (query.year) filter.year = Number(query.year);
  if (query.month) filter.month = Number(query.month);

  const records = await StaffExpenseModel.find(filter)
    .populate({
      path: 'pstaff',
      populate: { path: 'office' },
    })
    .populate('recordedBy', 'name rank bdNo role')
    .sort({ date: 1, 'pstaff.name': 1 });

  return records.map((r) => ({
    ...r.toObject(),
    amountInTaka: toTaka(r.amount),
  }));
};

const deleteStaffExpense = async (id: string, userId?: string) => {
  const expense = await StaffExpenseModel.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedBy: userId },
    { new: true },
  );
  if (!expense) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Staff expense record not found');
  }
  return expense;
};

export const StaffExpenseService = {
  upsertStaffExpense,
  bulkUpsertStaffExpenses,
  getStaffExpenses,
  deleteStaffExpense,
};
