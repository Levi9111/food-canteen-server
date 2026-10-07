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
    name: z.string().min(2).optional(),
    rooms: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

const addRoomSchema = z.object({
  body: z.object({
    roomName: z.string({ required_error: 'Room name is required' }).min(1),
  }),
});

export const SquadronValidation = {
  createSquadronSchema,
  updateSquadronSchema,
  addRoomSchema,
};
