import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClosingService } from './closing.service';

const closeMonth = catchAsync(async (req: Request, res: Response) => {
  const result = await ClosingService.closeMonth(req.body, req.user?.userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getClosings = catchAsync(async (req: Request, res: Response) => {
  const result = await ClosingService.getClosings(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Monthly closings retrieved successfully',
    data: result,
  });
});

const reopenPeriod = catchAsync(async (req: Request, res: Response) => {
  const result = await ClosingService.reopenPeriod(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const ClosingControllers = {
  closeMonth,
  getClosings,
  reopenPeriod,
};
