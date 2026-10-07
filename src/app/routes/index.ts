import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { OfficeRoutes } from '../modules/Office/office.route';
import { EntryRoutes } from '../modules/Entry/entry.route';
import { RoomExpenseRoutes } from '../modules/RoomExpense/roomexpense.route';
import { PStaffRoutes } from '../modules/PStaff/pstaff.route';
import { StaffExpenseRoutes } from '../modules/StaffExpense/staffexpense.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { ReportRoutes } from '../modules/Report/report.route';
import { ClosingRoutes } from '../modules/Closing/closing.route';
import { MetaRoutes } from '../modules/Meta/meta.route';
import { SquadronRoutes } from '../modules/Squadron/squadron.route';
// --- INJECT IMPORTS HERE ---

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/offices', route: OfficeRoutes },
  { path: '/entries', route: EntryRoutes },
  { path: '/squadrons', route: SquadronRoutes },
  { path: '/room-expenses', route: RoomExpenseRoutes },
  { path: '/pstaffs', route: PStaffRoutes },
  { path: '/staff-expenses', route: StaffExpenseRoutes },
  { path: '/payments', route: PaymentRoutes },
  { path: '/reports', route: ReportRoutes },
  { path: '/closings', route: ClosingRoutes },
  { path: '/meta', route: MetaRoutes },
  // --- INJECT ROUTES HERE ---
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
