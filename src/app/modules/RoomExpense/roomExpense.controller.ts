import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoomExpenseService } from './roomExpense.service';

const upsertRoomExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomExpenseService.upsertRoomExpense(
    req.body,
    req.user?.userId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Room expense recorded successfully in book',
    data: result,
  });
});

const bulkUpsertRoomExpenses = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RoomExpenseService.bulkUpsertRoomExpenses(
      req.body.expenses,
      req.user?.userId,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Batch room expenses recorded successfully',
      data: result,
    });
  },
);

const getRoomExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomExpenseService.getRoomExpenses(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Room expenses retrieved successfully',
    data: result,
  });
});

const deleteRoomExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomExpenseService.deleteRoomExpense(
    req.params.id as string,
    req.user?.userId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Room expense deleted successfully',
    data: result,
  });
});

export const RoomExpenseControllers = {
  upsertRoomExpense,
  bulkUpsertRoomExpenses,
  getRoomExpenses,
  deleteRoomExpense,
};
