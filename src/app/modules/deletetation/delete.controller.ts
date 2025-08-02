import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { Parcel } from "../parcel/parcel.model";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "../user/user.model";
import { Payment } from "../payment/payment.model";


const deleteData = catchAsync(async (req: Request, res: Response) => {

    const deleteDatas = await Parcel.deleteMany({});
    const deletePatas = await Payment.deleteMany({});
    // const deleteDatas = await User.deleteMany({});

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Data deleted Successfully",
        data: deleteDatas,
    })
});


export const deleteController = {
    deleteData,
};