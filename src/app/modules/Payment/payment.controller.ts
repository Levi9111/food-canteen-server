import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const recordPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.recordPayment(req.body, req.user?.userId);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Payment recorded successfully',
    data: result,
  });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPayments(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.deletePayment(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment record deleted successfully',
    data: result,
  });
});

export const PaymentControllers = {
  recordPayment,
  getPayments,
  deletePayment,
};
