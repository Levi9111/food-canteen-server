import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { OfficeControllers } from './office.controller';
import { OfficeValidation } from './office.validation';

const router = express.Router();

router.get('/', OfficeControllers.getAllOffices);

router.get('/:id', OfficeControllers.getOfficeById);

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(OfficeValidation.createOfficeSchema),
  OfficeControllers.createOffice,
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(OfficeValidation.updateOfficeSchema),
  OfficeControllers.updateOffice,
);

router.delete('/:id', auth('ADMIN'), OfficeControllers.deleteOffice);

export const OfficeRoutes = router;
