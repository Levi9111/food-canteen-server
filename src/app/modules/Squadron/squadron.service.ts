import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { ISquadron } from './squadron.interface';
import { SquadronModel } from './squadron.model';

const DEFAULT_SQUADRONS = [
  'Sadruddin',
  'Liakot Ali',
  'Nurul Haque',
  'Mansur Ali',
];

const DEFAULT_ROOMS = Array.from({ length: 16 }, (_, i) => `Room ${i + 1}`);

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
  const squadron = await SquadronModel.findById(id);
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

  const existing = await SquadronModel.findOne({ name: trimmedName });
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
  const squadron = await SquadronModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }
  return squadron;
};

const deleteSquadron = async (id: string) => {
  const squadron = await SquadronModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }
  return squadron;
};

const addRoomToSquadron = async (id: string, roomName: string) => {
  const trimmed = roomName.trim();
  const squadron = await SquadronModel.findById(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  if (squadron.rooms.includes(trimmed)) {
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
  const squadron = await SquadronModel.findById(id);
  if (!squadron) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Squadron not found');
  }

  squadron.rooms = squadron.rooms.filter((r) => r !== trimmed);
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
