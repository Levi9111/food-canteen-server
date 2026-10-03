import { Types } from 'mongoose';
import {
  TCustomerType,
  TSquadron,
  TRoom,
} from '../../constants/canteen.constants';
import { IPStaff } from '../PStaff/pstaff.interface';

export interface IMonthlyClosing {
  _id?: string;
  customerType: TCustomerType;
  entry?: string;
  squadron?: TSquadron;
  room?: TRoom;
  pstaff?: Types.ObjectId | string | IPStaff;
  year: number;
  month: number;
  previousDue: number; // In integer paisa
  monthlyConsumption: number; // In integer paisa
  grandTotal: number; // In integer paisa
  paid: number; // In integer paisa
  netDue: number; // In integer paisa (carried forward)
  activeDaysCount: number;
  closedBy?: Types.ObjectId | string;
  closedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
