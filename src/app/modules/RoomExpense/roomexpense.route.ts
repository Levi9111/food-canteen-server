import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { RoomExpenseControllers } from './roomexpense.controller';
import { RoomExpenseValidation } from './roomexpense.validation';

const router = express.Router();

router.put(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(RoomExpenseValidation.upsertRoomExpenseSchema),
  RoomExpenseControllers.upsertRoomExpense,
);

router.put(
  '/bulk',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(RoomExpenseValidation.bulkUpsertRoomExpenseSchema),
  RoomExpenseControllers.bulkUpsertRoomExpenses,
);

router.get(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(RoomExpenseValidation.queryRoomExpenseSchema),
  RoomExpenseControllers.getRoomExpenses,
);

router.delete(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  RoomExpenseControllers.deleteRoomExpense,
);

export const RoomExpenseRoutes = router;
