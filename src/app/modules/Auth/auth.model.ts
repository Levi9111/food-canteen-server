import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  CANTEEN_CONSTANTS,
  TManagerRole,
  TBafRank,
} from '../../constants/canteen.constants';
import config from '../../config';

export interface IUser {
  _id?: string;
  username: string;
  name: string;
  rank: TBafRank;
  bdNo: string;
  email?: string;
  password: string;
  role: TManagerRole;
  phone?: string;
  trade?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rank: {
      type: String,
      enum: CANTEEN_CONSTANTS.ranks,
      required: true,
      default: 'Sgt',
    },
    bdNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    trade: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: CANTEEN_CONSTANTS.roles,
      required: true,
      default: 'NCOIC',
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, config.bcrypt_salt_rounds);
});

userSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

export const UserModel = model<IUser>('User', userSchema);
