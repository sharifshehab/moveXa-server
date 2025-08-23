import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { statsServices } from "./stats.service";

// Get user stats
const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const userStatus = await statsServices.getUserStats();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User Status Retrieved Successfully",
        data: userStatus,
    })
});
// Get parcel stats
const getParcelStats = catchAsync(async (req: Request, res: Response) => {
    const parcelStatus = await statsServices.getParcelStats();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Parcel Status Retrieved Successfully",
        data: parcelStatus,
    })
});
// Get payment stats
const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const paymentStatus = await statsServices.getPaymentStats();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Payment Status Retrieved Successfully",
        data: paymentStatus,
    })
});

export const statsController = {
    getUserStats,
    getParcelStats,
    getPaymentStats
};