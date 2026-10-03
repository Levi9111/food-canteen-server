import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { StaffExpenseControllers } from './staffExpense.controller';
import { StaffExpenseValidation } from './staffExpense.validation';

const router = express.Router();

router.put(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(StaffExpenseValidation.upsertStaffExpenseSchema),
  StaffExpenseControllers.upsertStaffExpense,
);

router.put(
  '/bulk',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(StaffExpenseValidation.bulkUpsertStaffExpenseSchema),
  StaffExpenseControllers.bulkUpsertStaffExpenses,
);

router.get(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(StaffExpenseValidation.queryStaffExpenseSchema),
  StaffExpenseControllers.getStaffExpenses,
);

router.delete(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  StaffExpenseControllers.deleteStaffExpense,
);

export const StaffExpenseRoutes = router;
