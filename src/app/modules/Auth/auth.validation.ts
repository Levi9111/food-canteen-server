import { z } from 'zod';
import { CANTEEN_CONSTANTS } from '../../constants/canteen.constants';

const loginSchema = z.object({
  body: z.object({
    loginId: z.string().min(1, 'Username, BD number, or email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
  }),
});

const registerUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    name: z.string().min(2, 'Name is required'),
    rank: z.enum(CANTEEN_CONSTANTS.ranks),
    bdNo: z.string().min(3, 'BD Number is required'),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(CANTEEN_CONSTANTS.roles).default('NCOIC'),
    phone: z.string().optional(),
  }),
});

export const AuthValidation = {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  registerUserSchema,
};
