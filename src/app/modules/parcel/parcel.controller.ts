import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from 'http-status-codes';
import { parcelServices } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

// Track Parcel
const trackParcel = catchAsync(async (req: Request, res: Response) => {
    const { trackingID } = req.params;
    const parcelStatus = await parcelServices.trackParcel(trackingID);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Parcel Status Retrieved Successfully",
        data: parcelStatus,
    })
});


/* SENDER API controllers */
// Send parcel to a user (i.e., user = RECEIVER)         
const sendParcel = catchAsync(async (req: Request, res: Response) => {
    const parcel = await parcelServices.sendParcel(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Parcel Created Successfully",
        data: parcel,
    })
});
// Get all parcels send by a user (i.e., user = SENDER) 
const getParcelsBySender = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const { senderId } = req.params;
    const query = req.query;
    const parcels = await parcelServices.getParcelsBySender(senderId, decodedToken as JwtPayload, query as Record<string, string>);

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
    const query = req.query;
    const parcels = await parcelServices.getReceiverParcels(receiverEmail, decodedToken as JwtPayload, query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Parcel Data Retrieved Successfully",
        data: parcels,
    })
});
// Confirm parcel received by the user (i.e., user = RECEIVER)
const parcelReceived = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const { parcelId } = req.params;
    const { receiveParcel } = req.body;
    const parcel = await parcelServices.parcelReceived(parcelId, receiveParcel, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: parcel?.currentStatus === "RECEIVED" ? "Parcel Received Successfully" : "Parcel Returned Successfully",
        data: parcel,
    })
});
// Parcel Delivery history
const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const { receiverEmail } = req.params;
    // const { page } = req.query;
    const deliveries = await parcelServices.getDeliveryHistory(receiverEmail, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Parcel Delivery History Retrieved Successfully",
        data: deliveries,
    })
});


/* Super Admin & Admin API controller */
// Get all parcels
const getAllParcels = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const allParcels = await parcelServices.getAllParcels(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All Parcels Retrieved Successfully",
        data: allParcels,
    })
});
// Change parcel status
const changeParcelStatus = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const { parcelId } = req.params;
    const { parcelStatus } = req.body;
    const parcel = await parcelServices.changeParcelStatus(parcelId, parcelStatus, decodedToken as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Parcel Status Changed Successfully",
        data: parcel,
    })
});

/* Super Admin API controller */
// Approve parcel
const approveParcel = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const { parcelId } = req.params;
    const parcel = await parcelServices.approveParcel(parcelId, decodedToken as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Parcel Approved Successfully",
        data: parcel,
    })
});


export const parcelController = {
    trackParcel,
    sendParcel,
    getParcelsBySender,
    cancelParcel,
    getReceiverParcels,
    parcelReceived,
    getDeliveryHistory,
    getAllParcels,
    changeParcelStatus,
    approveParcel
};