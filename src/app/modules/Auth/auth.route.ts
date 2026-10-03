import express from 'express';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth.middleware';
import validateRequest from '../../utils/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  AuthControllers.login,
);

router.post(
  '/refresh',
  validateRequest(AuthValidation.refreshTokenSchema),
  AuthControllers.refreshToken,
);

router.get(
  '/profile',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  AuthControllers.getProfile,
);

router.patch(
  '/change-password',
  auth('ADMIN', 'NCOIC', 'JCOIC', 'WOIC'),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthControllers.changePassword,
);

router.post(
  '/users',
  auth('ADMIN'),
  validateRequest(AuthValidation.registerUserSchema),
  AuthControllers.registerUser,
);

router.get('/users', auth('ADMIN'), AuthControllers.getAllUsers);

router.patch('/users/:id', auth('ADMIN'), AuthControllers.updateUser);

export const AuthRoutes = router;
