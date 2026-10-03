import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { ClosingControllers } from './closing.controller';
import { ClosingValidation } from './closing.validation';

const router = express.Router();

router.post(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(ClosingValidation.closeMonthSchema),
  ClosingControllers.closeMonth,
);

router.get(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(ClosingValidation.queryClosingSchema),
  ClosingControllers.getClosings,
);

router.post('/reopen', auth('ADMIN'), ClosingControllers.reopenPeriod);

export const ClosingRoutes = router;
