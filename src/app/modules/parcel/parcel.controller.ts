import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { senderServices } from "./parcel.service";

// Send parcel to a User (i.e., User = RECEIVER)
const sendParcel = catchAsync(async (req: Request, res: Response) => {
    const parcel = await senderServices.sendParcel(req.body);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Created Successfully",
        data: parcel,
    })
});


// Get all parcels send by a User (i.e., User = SENDER)
const getParcelsBySender = catchAsync(async (req: Request, res: Response) => {
    const { senderId } = req.params;
    const parcel = await senderServices.getParcelsBySender(senderId);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Data Retrieved Successfully",
        data: parcel,
    })
});


export const senderController = {
    sendParcel,
    getParcelsBySender,
//   getUserById,
//   updateUser,
//   deleteUser
};