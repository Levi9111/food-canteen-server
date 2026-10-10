import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import config from '../../config';
import {
  CANTEEN_CONSTANTS,
  TSquadron,
  TRoom,
} from '../../constants/canteen.constants';
import AppError from '../../errors/AppError';
import {
  getDhakaDateString,
  getDaysInMonth,
  getCurrentDhakaDate,
} from '../../utils/dhakaDate';
import { toTaka } from '../../utils/money';
import { MonthlyClosingModel } from '../Closing/closing.model';
import { PaymentModel } from '../Payment/payment.model';
import { PStaffModel } from '../PStaff/pstaff.model';
import { RoomExpenseModel } from '../RoomExpense/roomexpense.model';
import { StaffExpenseModel } from '../StaffExpense/staffexpense.model';
import { SquadronModel } from '../Squadron/squadron.model';

import {
  IRoomDailyReportResponse,
  IRoomMonthlyMatrixResponse,
  IRoomMonthlyMatrixRow,
  IPStaffMonthlyMatrixRow,
  IPStaffPublicStatementResponse,
  IPStaffStatementDay,
} from './report.interface';

const getRoomsDailyReport = async (
  entryInput?: string,
  dateInput?: string,
): Promise<IRoomDailyReportResponse> => {
  const entry = entryInput?.trim() || CANTEEN_CONSTANTS.defaultEntry;
  const date = dateInput?.trim() || getDhakaDateString();

  const expenses = await RoomExpenseModel.find({
    entry,
    date,
    isDeleted: false,
  }).populate('recordedBy', 'name rank role');

  const expMap = new Map<string, (typeof expenses)[0]>();
  for (const exp of expenses) {
    expMap.set(`${exp.squadron}|${exp.room}`, exp);
  }

  let grandTotalPaisa = 0;
  const activeSqns = await SquadronModel.find({ isActive: true }).sort({
    createdAt: 1,
  });
  const squadronsList =
    activeSqns.length > 0
      ? activeSqns.map((s) => ({ name: s.name, rooms: s.rooms }))
      : CANTEEN_CONSTANTS.squadrons.map((sqn) => ({
          name: sqn,
          rooms: Array.from(CANTEEN_CONSTANTS.rooms),
        }));

  const squadronsData = squadronsList.map((sqnItem) => {
    let sqnTotalPaisa = 0;
    const rooms = sqnItem.rooms.map((room) => {
      const rec = expMap.get(`${sqnItem.name}|${room}`);
      const amtPaisa = rec ? rec.amount : 0;
      sqnTotalPaisa += amtPaisa;

      return {
        room,
        amountInTaka: toTaka(amtPaisa),
        recordedBy: rec?.recordedBy
          ? (rec.recordedBy as unknown as { name: string }).name
          : undefined,
        representativeName: rec?.representativeName,
        itemsDescription: rec?.itemsDescription,
      };
    });

    grandTotalPaisa += sqnTotalPaisa;

    return {
      squadron: sqnItem.name,
      totalInTaka: toTaka(sqnTotalPaisa),
      rooms,
    };
  });

  return {
    entry,
    date,
    grandTotalInTaka: toTaka(grandTotalPaisa),
    squadrons: squadronsData,
  };
};

const getRoomsMonthlyMatrix = async (
  entryInput: string,
  squadron: TSquadron,
  year: number,
  month: number,
): Promise<IRoomMonthlyMatrixResponse> => {
  const entry = entryInput.trim();
  const daysInMonth = getDaysInMonth(year, month);

  // 1. Fetch expenses for this squadron, entry, month & year
  const expenses = await RoomExpenseModel.find({
    entry,
    squadron,
    year,
    month,
    isDeleted: false,
  });

  const sqnDoc = await SquadronModel.findOne({
    name: {
      $regex: new RegExp(
        `^${squadron.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()}$`,
        'i',
      ),
    },
  });
  const roomList =
    sqnDoc && sqnDoc.rooms.length > 0
      ? sqnDoc.rooms
      : Array.from(CANTEEN_CONSTANTS.rooms);

  // Map: room -> day -> amount
  const roomDaysMap = new Map<string, Map<number, number>>();
  for (const room of roomList) {
    roomDaysMap.set(room, new Map<number, number>());
  }

  for (const exp of expenses) {
    const dayMap = roomDaysMap.get(exp.room);
    if (dayMap) {
      dayMap.set(exp.day, exp.amount);
    }
  }

  // 2. Fetch payments for this squadron in this month
  const payments = await PaymentModel.find({
    customerType: 'RECRUIT_ROOM',
    entry,
    squadron,
    year,
    month,
  });

  const roomPaidMap = new Map<string, number>();
  for (const p of payments) {
    if (p.room) {
      const current = roomPaidMap.get(p.room) || 0;
      roomPaidMap.set(p.room, current + p.amount);
    }
  }

  // 3. Fetch prior month closings for this squadron and entry
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const priorClosings = await MonthlyClosingModel.find({
    customerType: 'RECRUIT_ROOM',
    entry,
    squadron,
    year: previousYear,
    month: previousMonth,
  });

  const roomPriorDueMap = new Map<string, number>();
  for (const c of priorClosings) {
    if (c.room) {
      roomPriorDueMap.set(c.room, c.netDue);
    }
  }

  let sqnPreDue = 0;
  let sqnMonthlyTotal = 0;
  let sqnGrandTotal = 0;
  let sqnPaid = 0;
  let sqnNetDue = 0;

  const rows: IRoomMonthlyMatrixRow[] = roomList.map((room) => {
    const dayMap = roomDaysMap.get(room) || new Map<number, number>();
    const daysObj: Record<number, number> = {};
    let monthlyPaisa = 0;
    let activeDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const amtPaisa = dayMap.get(d) || 0;
      daysObj[d] = toTaka(amtPaisa);
      if (amtPaisa > 0) {
        monthlyPaisa += amtPaisa;
        activeDays++;
      }
    }

    // Previous due from prior month closing if closed, otherwise 0
    const preDuePaisa = roomPriorDueMap.get(room) || 0;
    const paidPaisa = roomPaidMap.get(room) || 0;
    const grandPaisa = preDuePaisa + monthlyPaisa;
    const netDuePaisa = grandPaisa - paidPaisa;

    sqnPreDue += preDuePaisa;
    sqnMonthlyTotal += monthlyPaisa;
    sqnGrandTotal += grandPaisa;
    sqnPaid += paidPaisa;
    sqnNetDue += netDuePaisa;

    return {
      room,
      days: daysObj,
      preDueInTaka: toTaka(preDuePaisa),
      monthlyTotalInTaka: toTaka(monthlyPaisa),
      grandTotalInTaka: toTaka(grandPaisa),
      paidInTaka: toTaka(paidPaisa),
      netDueInTaka: toTaka(netDuePaisa),
      activeDaysCount: activeDays,
    };
  });

  return {
    entry,
    squadron,
    year,
    month,
    daysInMonth,
    rows,
    squadronTotals: {
      preDueInTaka: toTaka(sqnPreDue),
      monthlyTotalInTaka: toTaka(sqnMonthlyTotal),
      grandTotalInTaka: toTaka(sqnGrandTotal),
      paidInTaka: toTaka(sqnPaid),
      netDueInTaka: toTaka(sqnNetDue),
    },
  };
};

const getRoomStatement = async (
  entry: string,
  squadron: TSquadron,
  room: TRoom,
  year: number,
  month: number,
) => {
  const daysInMonth = getDaysInMonth(year, month);

  const expenses = await RoomExpenseModel.find({
    entry,
    squadron,
    room,
    year,
    month,
    isDeleted: false,
  }).populate('recordedBy', 'name rank role');

  const payments = await PaymentModel.find({
    customerType: 'RECRUIT_ROOM',
    entry,
    squadron,
    room,
    year,
    month,
  });

  const dayExpMap = new Map<number, (typeof expenses)[0]>();
  let monthlyPaisa = 0;
  let activeDays = 0;

  for (const exp of expenses) {
    dayExpMap.set(exp.day, exp);
    monthlyPaisa += exp.amount;
    activeDays++;
  }

  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const rec = dayExpMap.get(d);
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    days.push({
      day: d,
      date: dateStr,
      amountInTaka: rec ? toTaka(rec.amount) : 0,
      representativeName: rec?.representativeName,
      itemsDescription: rec?.itemsDescription,
      recordedBy: rec?.recordedBy
        ? (rec.recordedBy as unknown as { name: string }).name
        : undefined,
    });
  }

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const priorClosing = await MonthlyClosingModel.findOne({
    customerType: 'RECRUIT_ROOM',
    entry,
    squadron,
    room,
    year: previousYear,
    month: previousMonth,
  });

  const paidPaisa = payments.reduce((sum, p) => sum + p.amount, 0);
  const preDuePaisa = priorClosing ? priorClosing.netDue : 0;
  const grandPaisa = preDuePaisa + monthlyPaisa;
  const netDuePaisa = grandPaisa - paidPaisa;

  return {
    entry,
    squadron,
    room,
    year,
    month,
    daysInMonth,
    days,
    summary: {
      preDueInTaka: toTaka(preDuePaisa),
      monthlyTotalInTaka: toTaka(monthlyPaisa),
      grandTotalInTaka: toTaka(grandPaisa),
      paidInTaka: toTaka(paidPaisa),
      netDueInTaka: toTaka(netDuePaisa),
      activeDaysCount: activeDays,
    },
    payments: payments.map((p) => ({
      amountInTaka: toTaka(p.amount),
      paidOn: p.paidOn,
      paymentMethod: p.paymentMethod,
      trxId: p.trxId,
      remarks: p.remarks,
    })),
  };
};

const getPStaffMonthlyMatrix = async (
  year: number,
  month: number,
  officeQuery?: string,
): Promise<{
  year: number;
  month: number;
  daysInMonth: number;
  rows: IPStaffMonthlyMatrixRow[];
  totals: {
    preDueInTaka: number;
    monthlyTotalInTaka: number;
    grandTotalInTaka: number;
    paidInTaka: number;
    netDueInTaka: number;
  };
}> => {
  const daysInMonth = getDaysInMonth(year, month);
  const staffFilter: Record<string, unknown> = { isActive: true };

  if (officeQuery && officeQuery !== 'ALL OFFICES') {
    if (isValidObjectId(officeQuery)) {
      staffFilter.office = officeQuery;
    }
  }

  const staffMembers = await PStaffModel.find(staffFilter)
    .populate('office')
    .sort({ rank: 1, name: 1 });

  const staffIds = staffMembers.map((s) => s.id);

  // Fetch all staff expenses in this month
  const expenses = await StaffExpenseModel.find({
    pstaff: { $in: staffIds },
    year,
    month,
    isDeleted: false,
  });

  const staffDaysMap = new Map<string, Map<number, number>>();
  for (const s of staffMembers) {
    staffDaysMap.set(s.id, new Map<number, number>());
  }

  for (const exp of expenses) {
    const sId = exp.pstaff.toString();
    const dayMap = staffDaysMap.get(sId);
    if (dayMap) {
      dayMap.set(exp.day, exp.amount);
    }
  }

  // Fetch all staff payments in this month
  const payments = await PaymentModel.find({
    customerType: 'P_STAFF',
    pstaff: { $in: staffIds },
    year,
    month,
  });

  const staffPaidMap = new Map<string, number>();
  for (const p of payments) {
    if (p.pstaff) {
      const sId = p.pstaff.toString();
      const current = staffPaidMap.get(sId) || 0;
      staffPaidMap.set(sId, current + p.amount);
    }
  }

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const priorClosings = await MonthlyClosingModel.find({
    customerType: 'P_STAFF',
    pstaff: { $in: staffIds },
    year: previousYear,
    month: previousMonth,
  });

  const staffPriorMap = new Map<string, number>();
  for (const c of priorClosings) {
    if (c.pstaff) {
      staffPriorMap.set(c.pstaff.toString(), c.netDue);
    }
  }

  let totalPreDue = 0;
  let totalMonthly = 0;
  let totalGrand = 0;
  let totalPaid = 0;
  let totalNetDue = 0;

  const rows: IPStaffMonthlyMatrixRow[] = staffMembers.map((staff) => {
    const dayMap = staffDaysMap.get(staff.id) || new Map<number, number>();
    const daysObj: Record<number, number> = {};
    let monthlyPaisa = 0;
    let activeDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const amtPaisa = dayMap.get(d) || 0;
      daysObj[d] = toTaka(amtPaisa);
      if (amtPaisa > 0) {
        monthlyPaisa += amtPaisa;
        activeDays++;
      }
    }

    const preDuePaisa = staffPriorMap.has(staff.id)
      ? staffPriorMap.get(staff.id)!
      : staff.openingDue || 0;
    const paidPaisa = staffPaidMap.get(staff.id) || 0;
    const grandPaisa = preDuePaisa + monthlyPaisa;
    const netDuePaisa = grandPaisa - paidPaisa;

    totalPreDue += preDuePaisa;
    totalMonthly += monthlyPaisa;
    totalGrand += grandPaisa;
    totalPaid += paidPaisa;
    totalNetDue += netDuePaisa;

    const officeName =
      typeof staff.office === 'object' && staff.office !== null
        ? (staff.office as unknown as { name: string }).name
        : 'N/A';

    return {
      staffId: staff.id,
      name: staff.name,
      rank: staff.rank,
      bdNo: staff.bdNo,
      office: officeName,
      days: daysObj,
      preDueInTaka: toTaka(preDuePaisa),
      monthlyTotalInTaka: toTaka(monthlyPaisa),
      grandTotalInTaka: toTaka(grandPaisa),
      paidInTaka: toTaka(paidPaisa),
      netDueInTaka: toTaka(netDuePaisa),
      activeDaysCount: activeDays,
    };
  });

  return {
    year,
    month,
    daysInMonth,
    rows,
    totals: {
      preDueInTaka: toTaka(totalPreDue),
      monthlyTotalInTaka: toTaka(totalMonthly),
      grandTotalInTaka: toTaka(totalGrand),
      paidInTaka: toTaka(totalPaid),
      netDueInTaka: toTaka(totalNetDue),
    },
  };
};

const getPStaffPublicStatement = async (
  keyOrBdNo: string,
  yearInput?: number,
  monthInput?: number,
): Promise<IPStaffPublicStatementResponse> => {
  const current = getCurrentDhakaDate();
  const year = yearInput || current.year;
  const month = monthInput || current.month;
  const daysInMonth = getDaysInMonth(year, month);

  // Search by accessKey or bdNo
  const staff = await PStaffModel.findOne({
    $or: [{ accessKey: keyOrBdNo }, { bdNo: keyOrBdNo.trim().toUpperCase() }],
  }).populate('office');

  if (!staff) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Staff profile not found');
  }

  const expenses = await StaffExpenseModel.find({
    pstaff: staff.id,
    year,
    month,
    isDeleted: false,
  }).populate('recordedBy', 'name rank role');

  const payments = await PaymentModel.find({
    customerType: 'P_STAFF',
    pstaff: staff.id,
    year,
    month,
  }).sort({ paidOn: -1 });

  const dayExpMap = new Map<number, (typeof expenses)[0]>();
  let monthlyPaisa = 0;
  let activeDays = 0;

  for (const exp of expenses) {
    dayExpMap.set(exp.day, exp);
    monthlyPaisa += exp.amount;
    activeDays++;
  }

  const days: IPStaffStatementDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const rec = dayExpMap.get(d);
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    days.push({
      day: d,
      date: dateStr,
      amountInTaka: rec ? toTaka(rec.amount) : 0,
      particulars: rec?.particulars,
      recordedBy: rec?.recordedBy
        ? (rec.recordedBy as unknown as { name: string }).name
        : undefined,
    });
  }

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const priorClosing = await MonthlyClosingModel.findOne({
    customerType: 'P_STAFF',
    pstaff: staff.id,
    year: previousYear,
    month: previousMonth,
  });

  const paidPaisa = payments.reduce((sum, p) => sum + p.amount, 0);
  const preDuePaisa = priorClosing
    ? priorClosing.netDue
    : staff.openingDue || 0;
  const grandPaisa = preDuePaisa + monthlyPaisa;
  const netDuePaisa = grandPaisa - paidPaisa;

  return {
    staff,
    year,
    month,
    daysInMonth,
    days,
    summary: {
      preDueInTaka: toTaka(preDuePaisa),
      monthlyTotalInTaka: toTaka(monthlyPaisa),
      grandTotalInTaka: toTaka(grandPaisa),
      paidInTaka: toTaka(paidPaisa),
      netDueInTaka: toTaka(netDuePaisa),
      activeDaysCount: activeDays,
    },
    payments: payments.map((p) => ({
      amountInTaka: toTaka(p.amount),
      paidOn: p.paidOn,
      paymentMethod: p.paymentMethod,
      trxId: p.trxId,
      remarks: p.remarks,
    })),
    adminPaymentInfo: {
      bkashNumber: config.admin_payment.bkash_number,
      bankAccountName: config.admin_payment.bank_account_name,
      bankAccountNumber: config.admin_payment.bank_account_number,
      bankName: config.admin_payment.bank_name,
      bankBranch: config.admin_payment.bank_branch,
      whatsappNumber: config.admin_payment.whatsapp_number,
    },
  };
};

export const ReportService = {
  getRoomsDailyReport,
  getRoomsMonthlyMatrix,
  getRoomStatement,
  getPStaffMonthlyMatrix,
  getPStaffPublicStatement,
};
