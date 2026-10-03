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

export const EntryService = {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
};
