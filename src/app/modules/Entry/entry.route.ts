import express from 'express';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { EntryControllers } from './entry.controller';
import { EntryValidation } from './entry.validation';

const router = express.Router();

router.get('/', EntryControllers.getAllEntries);

router.get('/:id', EntryControllers.getEntryById);

router.post(
  '/',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(EntryValidation.createEntrySchema),
  EntryControllers.createEntry,
);

router.patch(
  '/:id',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(EntryValidation.updateEntrySchema),
  EntryControllers.updateEntry,
);

export const EntryRoutes = router;
