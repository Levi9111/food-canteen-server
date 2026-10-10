import { StatusCodes } from 'http-status-codes';
import {
  CANTEEN_CONSTANTS,
  TCustomerType,
} from '../../constants/canteen.constants';
import AppError from '../../errors/AppError';
import { toTaka } from '../../utils/money';
import { PaymentModel } from '../Payment/payment.model';
import { PStaffModel } from '../PStaff/pstaff.model';
import { RoomExpenseModel } from '../RoomExpense/roomexpense.model';
import { StaffExpenseModel } from '../StaffExpense/staffexpense.model';
import { SquadronModel } from '../Squadron/squadron.model';
import { MonthlyClosingModel } from './closing.model';

const closeMonth = async (
  payload: {
    customerType: TCustomerType;
    entry?: string;
    year: number;
    month: number;
  },
  userId?: string,
) => {
  const { customerType, year, month } = payload;

  if (customerType === 'RECRUIT_ROOM') {
    const entry = payload.entry?.trim() || CANTEEN_CONSTANTS.defaultEntry;
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const savedRecords = [];

    const activeSqns = await SquadronModel.find({ isActive: true });
    const squadronList =
      activeSqns.length > 0
        ? activeSqns.map((s) => ({ name: s.name, rooms: s.rooms }))
        : CANTEEN_CONSTANTS.squadrons.map((sqn) => ({
            name: sqn,
            rooms: Array.from(CANTEEN_CONSTANTS.rooms),
          }));

    for (const sqnItem of squadronList) {
      const sqn = sqnItem.name;
      for (const room of sqnItem.rooms) {
        // Prior month closing
        const prior = await MonthlyClosingModel.findOne({
          customerType: 'RECRUIT_ROOM',
          entry,
          squadron: sqn,
          room,
          year: previousYear,
          month: previousMonth,
        });

        const preDuePaisa = prior ? prior.netDue : 0;

        // Current month expenses
        const expenses = await RoomExpenseModel.find({
          entry,
          squadron: sqn,
          room,
          year,
          month,
          isDeleted: false,
        });

        const monthlyConsumptionPaisa = expenses.reduce(
          (sum, e) => sum + e.amount,
          0,
        );

        // Current month payments
        const payments = await PaymentModel.find({
          customerType: 'RECRUIT_ROOM',
          entry,
          squadron: sqn,
          room,
          year,
          month,
        });

        const paidPaisa = payments.reduce((sum, p) => sum + p.amount, 0);
        const grandTotalPaisa = preDuePaisa + monthlyConsumptionPaisa;
        const netDuePaisa = grandTotalPaisa - paidPaisa;

        const closingDoc = await MonthlyClosingModel.findOneAndUpdate(
          {
            customerType: 'RECRUIT_ROOM',
            entry,
            squadron: sqn,
            room,
            year,
            month,
          },
          {
            $set: {
              previousDue: preDuePaisa,
              monthlyConsumption: monthlyConsumptionPaisa,
              grandTotal: grandTotalPaisa,
              paid: paidPaisa,
              netDue: netDuePaisa,
              activeDaysCount: expenses.length,
              closedBy: userId,
              closedAt: new Date(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        savedRecords.push(closingDoc);
      }
    }

    return {
      message: `Recruits canteen closed for Entry ${entry}, ${month}/${year}`,
      recordsCount: savedRecords.length,
    };
  }

  if (customerType === 'P_STAFF') {
    const staffMembers = await PStaffModel.find({ isActive: true });
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const savedRecords = [];

    for (const staff of staffMembers) {
      // Prior month closing
      const prior = await MonthlyClosingModel.findOne({
        customerType: 'P_STAFF',
        pstaff: staff.id,
        year: previousYear,
        month: previousMonth,
      });

      const preDuePaisa = prior ? prior.netDue : staff.openingDue || 0;

      // Current month expenses
      const expenses = await StaffExpenseModel.find({
        pstaff: staff.id,
        year,
        month,
        isDeleted: false,
      });

      const monthlyConsumptionPaisa = expenses.reduce(
        (sum, e) => sum + e.amount,
        0,
      );

      // Current month payments
      const payments = await PaymentModel.find({
        customerType: 'P_STAFF',
        pstaff: staff.id,
        year,
        month,
      });

      const paidPaisa = payments.reduce((sum, p) => sum + p.amount, 0);
      const grandTotalPaisa = preDuePaisa + monthlyConsumptionPaisa;
      const netDuePaisa = grandTotalPaisa - paidPaisa;

      const closingDoc = await MonthlyClosingModel.findOneAndUpdate(
        {
          customerType: 'P_STAFF',
          pstaff: staff.id,
          year,
          month,
        },
        {
          $set: {
            previousDue: preDuePaisa,
            monthlyConsumption: monthlyConsumptionPaisa,
            grandTotal: grandTotalPaisa,
            paid: paidPaisa,
            netDue: netDuePaisa,
            activeDaysCount: expenses.length,
            closedBy: userId,
            closedAt: new Date(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      savedRecords.push(closingDoc);
    }

    return {
      message: `P-Staff canteen closed for ${month}/${year}`,
      recordsCount: savedRecords.length,
    };
  }

  throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid customer type');
};

const getClosings = async (query: {
  customerType?: string;
  entry?: string;
  year?: string | number;
  month?: string | number;
}) => {
  const filter: Record<string, unknown> = {};

  if (query.customerType) filter.customerType = query.customerType;
  if (query.entry) filter.entry = query.entry;
  if (query.year) filter.year = Number(query.year);
  if (query.month) filter.month = Number(query.month);

  const closings = await MonthlyClosingModel.find(filter)
    .populate('pstaff')
    .populate('closedBy', 'name rank role')
    .sort({ year: -1, month: -1 });

  return closings.map((c) => ({
    ...c.toObject(),
    previousDueInTaka: toTaka(c.previousDue),
    monthlyConsumptionInTaka: toTaka(c.monthlyConsumption),
    grandTotalInTaka: toTaka(c.grandTotal),
    paidInTaka: toTaka(c.paid),
    netDueInTaka: toTaka(c.netDue),
  }));
};

const reopenPeriod = async (query: {
  customerType: TCustomerType;
  entry?: string;
  year: number;
  month: number;
}) => {
  const filter: Record<string, unknown> = {
    customerType: query.customerType,
    year: query.year,
    month: query.month,
  };
  if (query.entry) filter.entry = query.entry;

  const result = await MonthlyClosingModel.deleteMany(filter);
  return {
    message: 'Period reopened successfully',
    deletedCount: result.deletedCount,
  };
};

export const ClosingService = {
  closeMonth,
  getClosings,
  reopenPeriod,
};
