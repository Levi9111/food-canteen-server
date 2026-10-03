import { Types } from 'mongoose';
import {
  TCustomerType,
  TPaymentMethod,
  TSquadron,
  TRoom,
} from '../../constants/canteen.constants';
import { IPStaff } from '../PStaff/pstaff.interface';

export interface IPayment {
  _id?: string;
  customerType: TCustomerType;
  entry?: string;
  squadron?: TSquadron;
  room?: TRoom;
  pstaff?: Types.ObjectId | string | IPStaff;
  year: number;
  month: number;
  amount: number; // In integer paisa
  paidOn: string; // YYYY-MM-DD
  paymentMethod: TPaymentMethod;
  trxId?: string;
  remarks?: string;
  receivedBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TPaymentInput = {
  customerType: TCustomerType;
  entry?: string;
  squadron?: TSquadron;
  room?: TRoom;
  pstaff?: string; // PStaff ObjectId or BD Number
  year: number;
  month: number;
  amount: number; // In Taka
  paidOn?: string; // YYYY-MM-DD
  paymentMethod?: TPaymentMethod;
  trxId?: string;
  remarks?: string;
};
