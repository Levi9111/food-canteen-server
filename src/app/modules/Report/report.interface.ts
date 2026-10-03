import { TSquadron, TRoom, TBafRank } from '../../constants/canteen.constants';
import { IPStaff } from '../PStaff/pstaff.interface';

export interface IRoomDailyReportItem {
  room: TRoom;
  amountInTaka: number;
  recordedBy?: string;
  representativeName?: string;
  itemsDescription?: string;
}

export interface ISquadronDailyReport {
  squadron: TSquadron;
  totalInTaka: number;
  rooms: IRoomDailyReportItem[];
}

export interface IRoomDailyReportResponse {
  entry: string;
  date: string;
  grandTotalInTaka: number;
  squadrons: ISquadronDailyReport[];
}

export interface IRoomMonthlyMatrixRow {
  room: TRoom;
  rank?: string;
  days: Record<number, number>; // day of month (1-31) -> amount in Taka
  preDueInTaka: number;
  monthlyTotalInTaka: number;
  grandTotalInTaka: number;
  paidInTaka: number;
  netDueInTaka: number;
  activeDaysCount: number;
}

export interface IRoomMonthlyMatrixResponse {
  entry: string;
  squadron: TSquadron;
  year: number;
  month: number;
  daysInMonth: number;
  rows: IRoomMonthlyMatrixRow[];
  squadronTotals: {
    preDueInTaka: number;
    monthlyTotalInTaka: number;
    grandTotalInTaka: number;
    paidInTaka: number;
    netDueInTaka: number;
  };
}

export interface IPStaffMonthlyMatrixRow {
  staffId: string;
  name: string;
  rank: TBafRank;
  bdNo: string;
  office: string;
  days: Record<number, number>; // day of month (1-31) -> amount in Taka
  preDueInTaka: number;
  monthlyTotalInTaka: number;
  grandTotalInTaka: number;
  paidInTaka: number;
  netDueInTaka: number;
  activeDaysCount: number;
}

export interface IPStaffStatementDay {
  day: number;
  date: string;
  amountInTaka: number;
  particulars?: string;
  recordedBy?: string;
}

export interface IPStaffPublicStatementResponse {
  staff: IPStaff;
  year: number;
  month: number;
  daysInMonth: number;
  days: IPStaffStatementDay[];
  summary: {
    preDueInTaka: number;
    monthlyTotalInTaka: number;
    grandTotalInTaka: number;
    paidInTaka: number;
    netDueInTaka: number;
    activeDaysCount: number;
  };
  payments: Array<{
    amountInTaka: number;
    paidOn: string;
    paymentMethod: string;
    trxId?: string;
    remarks?: string;
  }>;
  adminPaymentInfo: {
    bkashNumber: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    bankBranch: string;
    whatsappNumber: string;
  };
}
