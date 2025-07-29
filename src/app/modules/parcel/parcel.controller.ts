import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { senderServices } from "./parcel.service";


const sendParcel = catchAsync(async (req: Request, res: Response) => {

    const parcel = await senderServices.sendParcelService(req.body);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Created Successfully",
        data: parcel,
    })
});


export const senderController = {
    sendParcel,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser
};