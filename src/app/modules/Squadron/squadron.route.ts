import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { SquadronControllers } from './squadron.controller';
import { SquadronValidation } from './squadron.validation';

const router = express.Router();

router.get('/', SquadronControllers.getAllSquadrons);
router.get('/:id', SquadronControllers.getSquadronById);

router.post(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(SquadronValidation.createSquadronSchema),
  SquadronControllers.createSquadron,
);

router.patch(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(SquadronValidation.updateSquadronSchema),
  SquadronControllers.updateSquadron,
);

router.delete(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  SquadronControllers.deleteSquadron,
);

router.post(
  '/:id/rooms',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(SquadronValidation.addRoomSchema),
  SquadronControllers.addRoomToSquadron,
);

router.delete(
  '/:id/rooms/:roomName',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  SquadronControllers.removeRoomFromSquadron,
);

export const SquadronRoutes = router;
