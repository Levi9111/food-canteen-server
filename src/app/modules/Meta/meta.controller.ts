import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MetaServices } from './meta.service';

const getConstants = catchAsync(async (_req: Request, res: Response) => {
  const result = await MetaServices.getConstants();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Canteen metadata and constants retrieved successfully',
    data: result,
  });
});

export const MetaControllers = { getConstants };
