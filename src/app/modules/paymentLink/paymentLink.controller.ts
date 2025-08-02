import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { paymentLinkServices } from "./paymentLink.service";


// Create payment link
const createPaymentLink = catchAsync(async (req: Request, res: Response) => {
    const paymentLink = await paymentLinkServices.createPaymentLink(req.body);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Payment Link Created Successfully",
        data: paymentLink,
    })
});


// Get payment link
const getPaymentLink = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { parcelId } = req.params;
    const paymentLink = await paymentLinkServices.getPaymentLink(parcelId, decodedToken as JwtPayload);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Payment Url Retrieved Successfully",
        data: paymentLink,
    })
});

export const paymentLinkController = {
    createPaymentLink,
    getPaymentLink
};

