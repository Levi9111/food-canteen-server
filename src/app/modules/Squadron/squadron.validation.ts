import { z } from 'zod';

const createSquadronSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Squadron name is required' }).min(2),
    rooms: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

const updateSquadronSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    rooms: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

const addRoomSchema = z.object({
  body: z
    .object({
      roomName: z.string().min(1).optional(),
      room: z.string().min(1).optional(),
    })
    .refine((data) => Boolean(data.roomName?.trim() || data.room?.trim()), {
      message: 'Room name is required',
    }),
});

export const SquadronValidation = {
  createSquadronSchema,
  updateSquadronSchema,
  addRoomSchema,
};
