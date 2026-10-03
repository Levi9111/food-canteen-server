import { Types } from 'mongoose';
import { TBafRank } from '../../constants/canteen.constants';
import { IOffice } from '../Office/office.interface';

export interface IPStaff {
  _id?: string;
  name: string;
  rank: TBafRank;
  bdNo: string;
  office: Types.ObjectId | string | IOffice;
  phone?: string;
  openingDue: number; // Integer Paisa
  accessKey?: string; // Unique public access key for web statement link
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TPStaffInput = {
  name: string;
  rank: TBafRank;
  bdNo: string;
  office: string; // Office ObjectId or Name
  phone?: string;
  openingDue?: number; // In Taka
  isActive?: boolean;
};
