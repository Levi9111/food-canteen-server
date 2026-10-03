import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { OfficeRoutes } from '../modules/Office/office.route';
import { EntryRoutes } from '../modules/Entry/entry.route';
// --- INJECT IMPORTS HERE ---

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/auth', route: AuthRoutes },
  { path: '/offices', route: OfficeRoutes },
  { path: '/entries', route: EntryRoutes },
  // --- INJECT ROUTES HERE ---
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
