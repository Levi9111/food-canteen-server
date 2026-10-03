import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { OfficeRoutes } from '../modules/Office/office.route';
import { EntryRoutes } from '../modules/Entry/entry.route';
import { RoomExpenseRoutes } from '../modules/RoomExpense/roomExpense.route';
import { PStaffRoutes } from '../modules/PStaff/pStaff.route';
import { StaffExpenseRoutes } from '../modules/StaffExpense/staffExpense.route';
// --- INJECT IMPORTS HERE ---

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/offices', route: OfficeRoutes },
  { path: '/entries', route: EntryRoutes },
  { path: '/room-expenses', route: RoomExpenseRoutes },
  { path: '/pstaffs', route: PStaffRoutes },
  { path: '/staff-expenses', route: StaffExpenseRoutes },
  // --- INJECT ROUTES HERE ---
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
