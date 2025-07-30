import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { parcelServices } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

// Get all parcels
const getAllParcels = catchAsync(async (req: Request, res: Response) => {

    const allParcels = await parcelServices.getAllParcels();  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "All Parcels Retrieved Successfully",
        data: allParcels,
    })
});


 /* SENDER API controllers */     
// Send parcel to a User (i.e., User = RECEIVER)         /* Done */------------------>
const sendParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const parcel = await parcelServices.sendParcel(req.body, decodedToken as JwtPayload);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Created Successfully",
        data: parcel,
    })
});


// Get all parcels send by a User (i.e., User = SENDER) /* Done */------------------>
const getParcelsBySender = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { senderId } = req.params;
    const parcels = await parcelServices.getParcelsBySender(senderId, decodedToken as JwtPayload);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Parcel Data Retrieved Successfully",
        data: parcels,
    })
});


// Cancel parcel 
const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { parcelId } = req.params;
    const updateParcel = await parcelServices.cancelParcel(parcelId, decodedToken as JwtPayload);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Parcel Canceled Successfully",
        data: updateParcel,
    })
});



 /* RECEIVER API controllers */
// Get all parcels send for a receiver 
const getReceiverParcels = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { receiverEmail } = req.params;
    const parcels = await parcelServices.getReceiverParcels(receiverEmail, decodedToken as JwtPayload);  

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
    const parcel = await parcelServices.parcelReceived(parcelId);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Received Successfully",
        data: parcel,
    })
});

// Parcel Delivery history
const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { receiverEmail } = req.params;
    const deliveries = await parcelServices.getDeliveryHistory(receiverEmail, decodedToken as JwtPayload);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "Parcel Delivery History Retrieved Successfully",
        data: deliveries,
    })
});

// Change parcel blocked status
const changeParcelBlockedStatus = catchAsync(async (req: Request, res: Response) => {
    const { parcelId } = req.params;
    const { parcelStatus } = req.body;
    const user = await parcelServices.changeParcelBlockedStatus(parcelId, parcelStatus);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "Parcel Status Changed Successfully",
        data: user,
    })
});


export const parcelController = {
    getAllParcels,
    sendParcel,
    getParcelsBySender,
    cancelParcel,
    getReceiverParcels,
    parcelReceived,
    getDeliveryHistory,
    changeParcelBlockedStatus
};