import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { userServices } from "./parcel.service";

/* Role = SENDER */
// Send parcel to a User (i.e., User = RECEIVER)
const sendParcel = catchAsync(async (req: Request, res: Response) => {
    const parcel = await userServices.sendParcel(req.body);  
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
    const parcels = await userServices.getParcelsBySender(senderId);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Parcel Data Retrieved Successfully",
        data: parcels,
    })
});


// Cancel parcel 
const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const { parcelId } = req.params;
    const updateParcel = await userServices.cancelParcel(parcelId);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Parcel Canceled Successfully",
        data: updateParcel,
    })
});



/* Role = RECEIVER */
// Get all parcels received by a user (i.e., User = RECEIVER)
const getReceiverParcels = catchAsync(async (req: Request, res: Response) => {
    const { receiverEmail } = req.params;
    const parcels = await userServices.getReceiverParcels(receiverEmail);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Data Retrieved Successfully",
        data: parcels,
    })
});

// Confirm parcel received by the user (i.e., User = RECEIVER)
const parcelReceived = catchAsync(async (req: Request, res: Response) => {
    const { parcelId } = req.params;
    const parcel = await userServices.parcelReceived(parcelId);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Received Successfully",
        data: parcel,
    })
});

// Parcel Delivery history
const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const { receiverEmail } = req.params;
    const deliveries = await userServices.getDeliveryHistory(receiverEmail);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Delivery History Retrieved Successfully",
        data: deliveries,
    })
});


export const userController = {
    sendParcel,
    getParcelsBySender,
    cancelParcel,
    getReceiverParcels,
    parcelReceived,
    getDeliveryHistory
};