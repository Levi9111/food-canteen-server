import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import config from '../../config';
import { createToken, verifyToken } from '../../utils/jwt.utils';
import { TLoginUser, TChangePassword } from './auth.interface';
import { UserModel, IUser } from './auth.model';

const loginUser = async (payload: TLoginUser) => {
  const queryId = payload.loginId.trim();
  const lowerId = queryId.toLowerCase();
  const upperId = queryId.toUpperCase();

  const user = await UserModel.findOne({
    $or: [{ username: lowerId }, { bdNo: upperId }, { email: lowerId }],
  }).select('+password');

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid login credentials');
  }

  if (!user.isActive) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Your account has been deactivated. Please contact Canteen Administration.',
    );
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid login credentials');
  }

  const jwtPayload = {
    userId: user.id || user._id,
    role: user.role,
    username: user.username,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.id || user._id,
      username: user.username,
      name: user.name,
      rank: user.rank,
      bdNo: user.bdNo,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);
    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'User is not authorized');
    }

    const jwtPayload = {
      userId: user.id || user._id,
      role: user.role,
      username: user.username,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return { accessToken };
  } catch {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Invalid or expired refresh token',
    );
  }
};

const changePassword = async (userId: string, payload: TChangePassword) => {
  const user = await UserModel.findById(userId).select('+password');
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

  const isOldMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isOldMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Current password does not match',
    );
  }

  user.password = payload.newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

const registerUser = async (payload: Partial<IUser>) => {
  const existing = await UserModel.findOne({
    $or: [
      { username: payload.username?.toLowerCase() },
      { bdNo: payload.bdNo },
    ],
  });

  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'User with this username or BD number already exists',
    );
  }

  const user = await UserModel.create(payload);
  return user;
};

const getAllUsers = async () => {
  return UserModel.find().sort({ createdAt: -1 });
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  // Prevent password update through this endpoint
  delete payload.password;
  const user = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  getProfile,
  registerUser,
  getAllUsers,
  updateUser,
};
