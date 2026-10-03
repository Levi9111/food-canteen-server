import { Types } from 'mongoose';
import { IPStaff } from '../PStaff/pstaff.interface';

export interface IStaffExpense {
  _id?: string;
  pstaff: Types.ObjectId | string | IPStaff;
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  amount: number; // In integer paisa
  particulars?: string;
  recordedBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TStaffExpenseInput = {
  pstaff: string; // PStaff ObjectId or BD Number
  date: string; // YYYY-MM-DD
  amount: number; // In Taka
  particulars?: string;
};
