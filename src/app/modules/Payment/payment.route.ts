import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { PaymentControllers } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router.post(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentControllers.recordPayment,
);

router.get(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(PaymentValidation.queryPaymentSchema),
  PaymentControllers.getPayments,
);

router.delete(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  PaymentControllers.deletePayment,
);

export const PaymentRoutes = router;
