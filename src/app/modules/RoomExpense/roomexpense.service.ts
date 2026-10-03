import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { parseDateParts } from '../../utils/dhakaDate';
import { toPaisa, toTaka } from '../../utils/money';
import { TRoomExpenseInput } from './roomexpense.interface';
import { RoomExpenseModel } from './roomexpense.model';

const upsertRoomExpense = async (
  payload: TRoomExpenseInput,
  userId?: string,
) => {
  const { year, month, day } = parseDateParts(payload.date);
  const paisaAmount = toPaisa(payload.amount);

  const filter = {
    entry: payload.entry.trim(),
    squadron: payload.squadron,
    room: payload.room,
    date: payload.date,
  };

  if (paisaAmount <= 0) {
    // If 0 or negative, remove record or soft-delete
    await RoomExpenseModel.findOneAndDelete(filter);
    return {
      deleted: true,
      message: 'Room expense cleared for the date',
    };
  }

  const update = {
    $set: {
      amount: paisaAmount,
      year,
      month,
      day,
      representativeName: payload.representativeName || '',
      itemsDescription: payload.itemsDescription || '',
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

  const result = await RoomExpenseModel.findOneAndUpdate(
    filter,
    update,
    options,
  );

  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to record room expense',
    );
  }

  return {
    ...result.toObject(),
    amountInTaka: toTaka(result.amount),
  };
};

const bulkUpsertRoomExpenses = async (
  expenses: TRoomExpenseInput[],
  userId?: string,
) => {
  const results = [];
  for (const exp of expenses) {
    const res = await upsertRoomExpense(exp, userId);
    results.push(res);
  }
  return results;
};

const getRoomExpenses = async (query: {
  entry?: string;
  squadron?: string;
  room?: string;
  date?: string;
  year?: string | number;
  month?: string | number;
}) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.entry) filter.entry = query.entry;
  if (query.squadron) filter.squadron = query.squadron;
  if (query.room) filter.room = query.room;
  if (query.date) filter.date = query.date;
  if (query.year) filter.year = Number(query.year);
  if (query.month) filter.month = Number(query.month);

  const records = await RoomExpenseModel.find(filter)
    .populate('recordedBy', 'name rank bdNo role')
    .populate('updatedBy', 'name rank bdNo role')
    .sort({ date: 1, squadron: 1, room: 1 });

  return records.map((r) => ({
    ...r.toObject(),
    amountInTaka: toTaka(r.amount),
  }));
};

const deleteRoomExpense = async (id: string, userId?: string) => {
  const expense = await RoomExpenseModel.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedBy: userId },
    { new: true },
  );
  if (!expense) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Room expense record not found');
  }
  return expense;
};

export const RoomExpenseService = {
  upsertRoomExpense,
  bulkUpsertRoomExpenses,
  getRoomExpenses,
  deleteRoomExpense,
};
