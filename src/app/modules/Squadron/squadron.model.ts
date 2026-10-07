import { Schema, model } from 'mongoose';
import { ISquadron } from './squadron.interface';

const squadronSchema = new Schema<ISquadron>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rooms: {
      type: [String],
      required: true,
      default: () => Array.from({ length: 16 }, (_, i) => `Room ${i + 1}`),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const SquadronModel = model<ISquadron>('Squadron', squadronSchema);
