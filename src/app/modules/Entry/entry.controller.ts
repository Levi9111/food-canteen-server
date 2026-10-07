import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EntryService } from './entry.service';

const getAllEntries = catchAsync(async (req: Request, res: Response) => {
  const includePassedOut = req.query.includePassedOut !== 'false';
  const result = await EntryService.getAllEntries(includePassedOut);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Entries retrieved successfully',
    data: result,
  });
});

const getEntryById = catchAsync(async (req: Request, res: Response) => {
  const result = await EntryService.getEntryById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Entry retrieved successfully',
    data: result,
  });
});

const createEntry = catchAsync(async (req: Request, res: Response) => {
  const result = await EntryService.createEntry({
    ...req.body,
    createdBy: req.user?.userId,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Entry created successfully',
    data: result,
  });
});

const updateEntry = catchAsync(async (req: Request, res: Response) => {
  const result = await EntryService.updateEntry(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Entry updated successfully',
    data: result,
  });
});

const getActiveEntry = catchAsync(async (req: Request, res: Response) => {
  const result = await EntryService.getActiveEntry();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Active entry retrieved successfully',
    data: result,
  });
});

const activateEntry = catchAsync(async (req: Request, res: Response) => {
  const result = await EntryService.activateEntry(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Entry activated successfully',
    data: result,
  });
});

export const EntryControllers = {
  getAllEntries,
  getActiveEntry,
  getEntryById,
  createEntry,
  updateEntry,
  activateEntry,
};
