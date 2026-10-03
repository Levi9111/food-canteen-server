import express from 'express';
import auth from '../../middlewares/auth.middleware';
import { ReportControllers } from './report.controller';

const router = express.Router();

// 1. Recruits Daily Breakdown
router.get(
  '/rooms/daily',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  ReportControllers.getRoomsDailyReport,
);

// 2. Recruits Monthly Matrix (31-day table)
router.get(
  '/rooms/monthly',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  ReportControllers.getRoomsMonthlyMatrix,
);

// 3. Recruits Single Room Statement
router.get(
  '/rooms/statement',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  ReportControllers.getRoomStatement,
);

// 4. P-Staff Monthly Matrix
router.get(
  '/pstaff/monthly',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  ReportControllers.getPStaffMonthlyMatrix,
);

// 5. P-Staff Public Statement Portal (no login required for staff viewing their personal link)
router.get(
  '/public/pstaff/:accessKey',
  ReportControllers.getPStaffPublicStatement,
);

export const ReportRoutes = router;
