import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StaffExpenseService } from './staffExpense.service';

const upsertStaffExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffExpenseService.upsertStaffExpense(
    req.body,
    req.user?.userId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff expense recorded successfully in book',
    data: result,
  });
});

const bulkUpsertStaffExpenses = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StaffExpenseService.bulkUpsertStaffExpenses(
      req.body.expenses,
      req.user?.userId,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Batch staff expenses recorded successfully',
      data: result,
    });
  },
);

const getStaffExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffExpenseService.getStaffExpenses(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff expenses retrieved successfully',
    data: result,
  });
});

const deleteStaffExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await StaffExpenseService.deleteStaffExpense(
    req.params.id as string,
    req.user?.userId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff expense deleted successfully',
    data: result,
  });
});

export const StaffExpenseControllers = {
  upsertStaffExpense,
  bulkUpsertStaffExpenses,
  getStaffExpenses,
  deleteStaffExpense,
};
