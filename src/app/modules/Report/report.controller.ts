import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TSquadron, TRoom } from '../../constants/canteen.constants';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReportService } from './report.service';

const getRoomsDailyReport = catchAsync(async (req: Request, res: Response) => {
  const { entry, date } = req.query as { entry?: string; date?: string };
  const result = await ReportService.getRoomsDailyReport(entry, date);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Rooms daily canteen report generated successfully',
    data: result,
  });
});

const getRoomsMonthlyMatrix = catchAsync(
  async (req: Request, res: Response) => {
    const { entry, squadron, year, month } = req.query as {
      entry: string;
      squadron: TSquadron;
      year: string;
      month: string;
    };

    const result = await ReportService.getRoomsMonthlyMatrix(
      entry,
      squadron,
      Number(year),
      Number(month),
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Rooms monthly ledger matrix generated successfully',
      data: result,
    });
  },
);

const getRoomStatement = catchAsync(async (req: Request, res: Response) => {
  const { entry, squadron, room, year, month } = req.query as {
    entry: string;
    squadron: TSquadron;
    room: TRoom;
    year: string;
    month: string;
  };

  const result = await ReportService.getRoomStatement(
    entry,
    squadron,
    room,
    Number(year),
    Number(month),
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Room monthly statement generated successfully',
    data: result,
  });
});

const getPStaffMonthlyMatrix = catchAsync(
  async (req: Request, res: Response) => {
    const { year, month, office } = req.query as {
      year: string;
      month: string;
      office?: string;
    };

    const result = await ReportService.getPStaffMonthlyMatrix(
      Number(year),
      Number(month),
      office,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'P-Staff monthly ledger matrix generated successfully',
      data: result,
    });
  },
);

const getPStaffPublicStatement = catchAsync(
  async (req: Request, res: Response) => {
    const { accessKey } = req.params;
    const { year, month } = req.query as { year?: string; month?: string };

    const result = await ReportService.getPStaffPublicStatement(
      accessKey as string,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'P-Staff personal statement fetched successfully',
      data: result,
    });
  },
);

export const ReportControllers = {
  getRoomsDailyReport,
  getRoomsMonthlyMatrix,
  getRoomStatement,
  getPStaffMonthlyMatrix,
  getPStaffPublicStatement,
};
