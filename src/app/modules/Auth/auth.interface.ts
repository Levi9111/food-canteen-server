import { TManagerRole, TBafRank } from '../../constants/canteen.constants';

export type TLoginUser = {
  loginId: string; // Accepts username, bdNo, or email
  password: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    username: string;
    name: string;
    rank: TBafRank;
    bdNo: string;
    trade?: string;
    email?: string;
    role: TManagerRole;
  };
};
