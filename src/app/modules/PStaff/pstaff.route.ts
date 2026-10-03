import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { PStaffControllers } from './pstaff.controller';
import { PStaffValidation } from './pstaff.validation';

const router = express.Router();

router.get(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  PStaffControllers.getAllStaff,
);

// Public link endpoint for staff to view their profile/statement info
router.get('/public/access/:accessKey', PStaffControllers.getStaffByAccessKey);

router.get(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  PStaffControllers.getStaffById,
);

router.post(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(PStaffValidation.createPStaffSchema),
  PStaffControllers.createPStaff,
);

router.patch(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(PStaffValidation.updatePStaffSchema),
  PStaffControllers.updatePStaff,
);

router.delete(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  PStaffControllers.deletePStaff,
);

export const PStaffRoutes = router;
