import { Types } from 'mongoose';
import { TSquadron, TRoom } from '../../constants/canteen.constants';

export interface IRoomExpense {
  _id?: string;
  entry: string;
  squadron: TSquadron;
  room: TRoom;
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  amount: number; // Integer Paisa (1 Tk = 100 Paisa)
  recordedBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  representativeName?: string;
  itemsDescription?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TRoomExpenseInput = {
  entry: string;
  squadron: TSquadron;
  room: TRoom;
  date: string; // YYYY-MM-DD
  amount: number; // In Taka (converted to paisa internally)
  representativeName?: string;
  itemsDescription?: string;
};
