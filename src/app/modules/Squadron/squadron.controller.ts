import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SquadronService } from './squadron.service';

const getAllSquadrons = catchAsync(async (req: Request, res: Response) => {
  const onlyActive = req.query.active !== 'false';
  const result = await SquadronService.getAllSquadrons(onlyActive);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Squadrons fetched successfully',
    data: result,
  });
});

const getSquadronById = catchAsync(async (req: Request, res: Response) => {
  const identifier = decodeURIComponent(req.params.id as string);
  const result = await SquadronService.getSquadronById(identifier);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Squadron fetched successfully',
    data: result,
  });
});

const createSquadron = catchAsync(async (req: Request, res: Response) => {
  const result = await SquadronService.createSquadron(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Squadron created successfully',
    data: result,
  });
});

const updateSquadron = catchAsync(async (req: Request, res: Response) => {
  const identifier = decodeURIComponent(req.params.id as string);
  const result = await SquadronService.updateSquadron(identifier, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Squadron updated successfully',
    data: result,
  });
});

const deleteSquadron = catchAsync(async (req: Request, res: Response) => {
  const identifier = decodeURIComponent(req.params.id as string);
  const result = await SquadronService.deleteSquadron(identifier);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Squadron deleted successfully',
    data: result,
  });
});

const addRoomToSquadron = catchAsync(async (req: Request, res: Response) => {
  const identifier = decodeURIComponent(req.params.id as string);
  const roomName = ((req.body.roomName || req.body.room) as string)?.trim();
  const result = await SquadronService.addRoomToSquadron(identifier, roomName);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Room added to squadron successfully',
    data: result,
  });
});

const removeRoomFromSquadron = catchAsync(
  async (req: Request, res: Response) => {
    const identifier = decodeURIComponent(req.params.id as string);
    const roomName = decodeURIComponent(
      (req.params.roomName as string) || '',
    ).trim();
    const result = await SquadronService.removeRoomFromSquadron(
      identifier,
      roomName,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Room removed from squadron successfully',
      data: result,
    });
  },
);

export const SquadronControllers = {
  getAllSquadrons,
  getSquadronById,
  createSquadron,
  updateSquadron,
  deleteSquadron,
  addRoomToSquadron,
  removeRoomFromSquadron,
};
