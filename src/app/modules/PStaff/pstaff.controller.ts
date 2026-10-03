import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PStaffService } from './pstaff.service';

const createPStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.createPStaff(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Permanent Staff enrolled successfully',
    data: result,
  });
});

const getAllStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.getAllStaff(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff profiles retrieved successfully',
    data: result,
  });
});

const getStaffById = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.getStaffById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff profile retrieved successfully',
    data: result,
  });
});

const getStaffByAccessKey = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.getStaffByAccessKey(
    req.params.accessKey as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff statement link verified',
    data: result,
  });
});

const updatePStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.updatePStaff(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff profile updated successfully',
    data: result,
  });
});

const deletePStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await PStaffService.deletePStaff(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Staff profile deactivated successfully',
    data: result,
  });
});

export const PStaffControllers = {
  createPStaff,
  getAllStaff,
  getStaffById,
  getStaffByAccessKey,
  updatePStaff,
  deletePStaff,
};
