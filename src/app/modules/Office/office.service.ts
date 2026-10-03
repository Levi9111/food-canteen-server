import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IOffice } from './office.interface';
import { OfficeModel } from './office.model';

const getAllOffices = async (includeInactive = false) => {
  const query = includeInactive ? {} : { isActive: true };
  return OfficeModel.find(query).sort({ sortOrder: 1, name: 1 });
};

const getOfficeById = async (id: string) => {
  const office = await OfficeModel.findById(id);
  if (!office) throw new AppError(StatusCodes.NOT_FOUND, 'Office not found');
  return office;
};

const createOffice = async (payload: IOffice) => {
  const existing = await OfficeModel.findOne({ name: payload.name.trim() });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, 'Office already exists');
  }
  return OfficeModel.create(payload);
};

const updateOffice = async (id: string, payload: Partial<IOffice>) => {
  const office = await OfficeModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!office) throw new AppError(StatusCodes.NOT_FOUND, 'Office not found');
  return office;
};

const deleteOffice = async (id: string) => {
  const office = await OfficeModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!office) throw new AppError(StatusCodes.NOT_FOUND, 'Office not found');
  return office;
};

export const OfficeService = {
  getAllOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
};
