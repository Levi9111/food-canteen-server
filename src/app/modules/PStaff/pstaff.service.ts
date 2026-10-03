import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import AppError from '../../errors/AppError';
import { toPaisa, toTaka } from '../../utils/money';
import { OfficeModel } from '../Office/office.model';
import { TPStaffInput } from './pstaff.interface';
import { PStaffModel } from './pstaff.model';

const resolveOfficeId = async (officeInput: string): Promise<string> => {
  if (isValidObjectId(officeInput)) {
    const existing = await OfficeModel.findById(officeInput);
    if (existing) return existing.id;
  }
  const officeByName = await OfficeModel.findOne({
    name: new RegExp(`^${officeInput.trim()}$`, 'i'),
  });
  if (officeByName) return officeByName.id;

  // Auto-create office if it does not exist
  const newOffice = await OfficeModel.create({ name: officeInput.trim() });
  return newOffice.id;
};

const createPStaff = async (payload: TPStaffInput) => {
  const upperBdNo = payload.bdNo.trim().toUpperCase();
  const existing = await PStaffModel.findOne({ bdNo: upperBdNo });
  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `P-Staff with BD number ${upperBdNo} already exists`,
    );
  }

  const officeId = await resolveOfficeId(payload.office);
  const openingDuePaisa = toPaisa(payload.openingDue || 0);

  const staff = await PStaffModel.create({
    name: payload.name.trim(),
    rank: payload.rank,
    bdNo: upperBdNo,
    office: officeId,
    phone: payload.phone?.trim(),
    openingDue: openingDuePaisa,
    isActive: payload.isActive ?? true,
  });

  return PStaffModel.findById(staff.id).populate('office');
};

const getAllStaff = async (query: {
  search?: string;
  office?: string;
  includeInactive?: string;
}) => {
  const filter: Record<string, unknown> = {};

  if (query.includeInactive !== 'true') {
    filter.isActive = true;
  }

  if (query.office && query.office !== 'ALL OFFICES') {
    if (isValidObjectId(query.office)) {
      filter.office = query.office;
    } else {
      const officeDoc = await OfficeModel.findOne({
        name: new RegExp(`^${query.office.trim()}$`, 'i'),
      });
      if (officeDoc) filter.office = officeDoc.id;
    }
  }

  if (query.search) {
    const q = query.search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { bdNo: { $regex: q, $options: 'i' } },
    ];
  }

  const staffList = await PStaffModel.find(filter)
    .populate('office')
    .sort({ rank: 1, name: 1 });

  return staffList.map((s) => ({
    ...s.toObject(),
    openingDueInTaka: toTaka(s.openingDue),
  }));
};

const getStaffById = async (id: string) => {
  const staff = await PStaffModel.findById(id).populate('office');
  if (!staff) {
    throw new AppError(StatusCodes.NOT_FOUND, 'P-Staff member not found');
  }
  return {
    ...staff.toObject(),
    openingDueInTaka: toTaka(staff.openingDue),
  };
};

const getStaffByAccessKey = async (accessKey: string) => {
  const staff = await PStaffModel.findOne({ accessKey }).populate('office');
  if (!staff) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Invalid statement link or staff record not found',
    );
  }
  return {
    ...staff.toObject(),
    openingDueInTaka: toTaka(staff.openingDue),
  };
};

const updatePStaff = async (id: string, payload: Partial<TPStaffInput>) => {
  const updateData: Record<string, unknown> = { ...payload };

  if (payload.bdNo) {
    updateData.bdNo = payload.bdNo.trim().toUpperCase();
  }
  if (payload.office) {
    updateData.office = await resolveOfficeId(payload.office);
  }
  if (payload.openingDue !== undefined) {
    updateData.openingDue = toPaisa(payload.openingDue);
  }

  const staff = await PStaffModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('office');

  if (!staff) {
    throw new AppError(StatusCodes.NOT_FOUND, 'P-Staff member not found');
  }

  return {
    ...staff.toObject(),
    openingDueInTaka: toTaka(staff.openingDue),
  };
};

const deletePStaff = async (id: string) => {
  const staff = await PStaffModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!staff) {
    throw new AppError(StatusCodes.NOT_FOUND, 'P-Staff member not found');
  }
  return staff;
};

export const PStaffService = {
  createPStaff,
  getAllStaff,
  getStaffById,
  getStaffByAccessKey,
  updatePStaff,
  deletePStaff,
};
