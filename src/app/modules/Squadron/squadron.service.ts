import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { ISquadron } from './squadron.interface';
import { SquadronModel } from './squadron.model';
import { RoomExpenseModel } from '../RoomExpense/roomexpense.model';
import { MonthlyClosingModel } from '../Closing/closing.model';
import { PaymentModel } from '../Payment/payment.model';

const DEFAULT_SQUADRONS = [
  'Sadruddin',
  'Liakot Ali',
  'Nurul Haque',
  'Mansur Ali',
];

const DEFAULT_ROOMS = Array.from({ length: 16 }, (_, i) => `Room ${i + 1}`);

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const findSquadronByIdOrName = async (identifier: string) => {
  const trimmed = identifier.trim();
  if (mongoose.isValidObjectId(trimmed)) {
    const doc = await SquadronModel.findById(trimmed);
    if (doc) return doc;
  }
  return SquadronModel.findOne({
    name: { $regex: new RegExp(`^${escapeRegExp(trimmed)}$`, 'i') },
  });
};

const seedDefaultSquadronsIfEmpty = async () => {
  const count = await SquadronModel.countDocuments();
  if (count === 0) {
    for (const name of DEFAULT_SQUADRONS) {
      await SquadronModel.create({
        name,
        rooms: DEFAULT_ROOMS,
        isActive: true,
      });
    }
  }
};

const getAllSquadrons = async (onlyActive = true) => {
  await seedDefaultSquadronsIfEmpty();
  const query = onlyActive ? { isActive: true } : {};
  return SquadronModel.find(query).sort({ createdAt: 1 });
};

const getSquadronById = async (id: string) => {
  const squadron = await findSquadronByIdOrName(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }
  return squadron;
};

const createSquadron = async (payload: Partial<ISquadron>) => {
  const trimmedName = payload.name?.trim();
  if (!trimmedName) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Squadron name is required');
  }

  const existing = await SquadronModel.findOne({
    name: { $regex: new RegExp(`^${escapeRegExp(trimmedName)}$`, 'i') },
  });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, 'Squadron already exists');
  }

  const rooms =
    payload.rooms && payload.rooms.length > 0 ? payload.rooms : DEFAULT_ROOMS;

  return SquadronModel.create({
    name: trimmedName,
    rooms,
    isActive: true,
    description: payload.description,
  });
};

const updateSquadron = async (id: string, payload: Partial<ISquadron>) => {
  const squadron = await findSquadronByIdOrName(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  const oldName = squadron.name;
  if (payload.name && payload.name.trim() && payload.name.trim() !== oldName) {
    const newName = payload.name.trim();
    const existing = await SquadronModel.findOne({
      name: { $regex: new RegExp(`^${escapeRegExp(newName)}$`, 'i') },
      _id: { $ne: squadron._id },
    });
    if (existing) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'A squadron with this name already exists',
      );
    }

    squadron.name = newName;

    // Cascade update historical and current records across expenses, closings, and payments
    await Promise.all([
      RoomExpenseModel.updateMany({ squadron: oldName }, { squadron: newName }),
      MonthlyClosingModel.updateMany(
        { squadron: oldName },
        { squadron: newName },
      ),
      PaymentModel.updateMany({ squadron: oldName }, { squadron: newName }),
    ]);
  }

  if (payload.rooms && Array.isArray(payload.rooms)) {
    squadron.rooms = payload.rooms;
  }
  if (payload.description !== undefined) {
    squadron.description = payload.description;
  }
  if (payload.isActive !== undefined) {
    squadron.isActive = payload.isActive;
  }

  await squadron.save();
  return squadron;
};

const deleteSquadron = async (id: string) => {
  const squadron = await findSquadronByIdOrName(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  squadron.isActive = false;
  await squadron.save();
  return squadron;
};

const addRoomToSquadron = async (id: string, roomName: string) => {
  const trimmed = roomName.trim();
  if (!trimmed) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Room name is required');
  }

  const squadron = await findSquadronByIdOrName(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  const alreadyExists = squadron.rooms.some(
    (r) => r.toLowerCase() === trimmed.toLowerCase(),
  );
  if (alreadyExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Room already exists in this squadron',
    );
  }

  squadron.rooms.push(trimmed);
  await squadron.save();
  return squadron;
};

const removeRoomFromSquadron = async (id: string, roomName: string) => {
  const trimmed = roomName.trim();
  const squadron = await findSquadronByIdOrName(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  squadron.rooms = squadron.rooms.filter(
    (r) => r.toLowerCase() !== trimmed.toLowerCase(),
  );
  await squadron.save();
  return squadron;
};

export const SquadronService = {
  getAllSquadrons,
  getSquadronById,
  createSquadron,
  updateSquadron,
  deleteSquadron,
  addRoomToSquadron,
  removeRoomFromSquadron,
  seedDefaultSquadronsIfEmpty,
};
