export type TLoginUser = {
  email: string;
  password: string;
};

export type TUserRole = 'ADMIN' | 'USER';

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    role: TUserRole;
  };
};
