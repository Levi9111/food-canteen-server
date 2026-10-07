import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IEntry } from './entry.interface';
import { EntryModel } from './entry.model';

const getAllEntries = async (includePassedOut = true) => {
  const query = includePassedOut ? {} : { status: 'ACTIVE' };
  return EntryModel.find(query).sort({ entryNo: -1 });
};

const getEntryById = async (id: string) => {
  const entry = await EntryModel.findById(id);
  if (!entry) throw new AppError(StatusCodes.NOT_FOUND, 'Entry not found');
  return entry;
};

const createEntry = async (payload: IEntry) => {
  const existing = await EntryModel.findOne({
    entryNo: payload.entryNo.trim(),
  });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, 'Entry batch already exists');
  }
  return EntryModel.create(payload);
};

const updateEntry = async (id: string, payload: Partial<IEntry>) => {
  const entry = await EntryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!entry) throw new AppError(StatusCodes.NOT_FOUND, 'Entry not found');
  return entry;
};

const getActiveEntry = async () => {
  let activeEntry = await EntryModel.findOne({ status: 'ACTIVE' }).sort({
    createdAt: -1,
  });
  if (!activeEntry) {
    activeEntry = await EntryModel.findOne().sort({ createdAt: -1 });
    if (!activeEntry) {
      activeEntry = await EntryModel.create({
        entryNo: '54',
        status: 'ACTIVE',
      });
    } else {
      activeEntry.status = 'ACTIVE';
      await activeEntry.save();
    }
  }
  return activeEntry;
};

const activateEntry = async (id: string) => {
  const entry = await EntryModel.findById(id);
  if (!entry) throw new AppError(StatusCodes.NOT_FOUND, 'Entry not found');

  await EntryModel.updateMany({ _id: { $ne: id } }, { status: 'PASSED_OUT' });
  entry.status = 'ACTIVE';
  await entry.save();
  return entry;
};

export const EntryService = {
  getAllEntries,
  getActiveEntry,
  getEntryById,
  createEntry,
  updateEntry,
  activateEntry,
};
