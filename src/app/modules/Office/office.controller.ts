import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfficeService } from './office.service';

const getAllOffices = catchAsync(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const result = await OfficeService.getAllOffices(includeInactive);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offices retrieved successfully',
    data: result,
  });
});

const getOfficeById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfficeService.getOfficeById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Office retrieved successfully',
    data: result,
  });
});

const createOffice = catchAsync(async (req: Request, res: Response) => {
  const result = await OfficeService.createOffice(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Office created successfully',
    data: result,
  });
});

const updateOffice = catchAsync(async (req: Request, res: Response) => {
  const result = await OfficeService.updateOffice(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Office updated successfully',
    data: result,
  });
});

const deleteOffice = catchAsync(async (req: Request, res: Response) => {
  const result = await OfficeService.deleteOffice(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Office deactivated successfully',
    data: result,
  });
});

export const OfficeControllers = {
  getAllOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
};
