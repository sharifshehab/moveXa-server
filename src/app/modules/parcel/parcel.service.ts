import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { feeCalculator } from "../../utils/feeCalculator";
import mongoose from "mongoose";
import dayjs from "dayjs";

/* Role = SENDER */
// Send parcel to a User (i.e., User = RECEIVER)
const sendParcel = async (payload: Partial<IParcel> & { insideDhaka: boolean}) => {  
    const { senderID,receiverEmail, weight, insideDhaka } = payload;

    // Checking is user blocked
    const sender = await User.findById(senderID);
    if (!sender) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    if (sender?.status === 'Blocked') {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is blocked");   
    }
    // Checking is receiver blocked
    const receiver = await User.findOne({email: receiverEmail});
    if (!receiver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");   
    }
    if (receiver?.status === 'Blocked') {
        throw new AppError(StatusCodes.BAD_REQUEST, "Receiver is blocked");   
    }

    // Generate tracking_Id
    const trackingID = generateTrackingId();
    // Calculate parcel fee
    const fee = feeCalculator(weight as number, insideDhaka);

    const parcel = await Parcel.create({...payload, fee, trackingID});
    return parcel;
};


// Get all parcels send by a User (i.e., User = SENDER)
const getParcelsBySender = async (senderId: string) => {  
    // Checking is user blocked
    const user = await User.findById(senderId);
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    if (user?.status === 'Blocked') {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is blocked");   
    }

    const parcels = await Parcel.find({senderID: senderId});
    return parcels; 
};


// Cancel Parcel 
const cancelParcel = async (parcelId: string) => {  
    // Checking is parcel blocked
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (parcel?.isBlocked) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is blocked");   
    }

    parcel.currentStatus = ParcelStatus.CANCELLED;
    parcel.isCancelled = true;
    parcel.statusLog.push({
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: new mongoose.Types.ObjectId("6888eae5bc449833ae074f82") // Remove this with the token user id
    });
    await parcel.save();
    return parcel; 
};




/* Role = RECEIVER */
// Get all parcels received by a user (i.e., User = RECEIVER)
const getReceiverParcels = async (receiverEmail: string) => {  
    // Checking is receiver blocked
    const receiver = await User.findOne({email: receiverEmail});
    if (!receiver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");   
    }
    if (receiver?.status === 'Blocked') {
        throw new AppError(StatusCodes.BAD_REQUEST, "Receiver is blocked");   
    }

    const parcels = await Parcel.find({receiverEmail});
    return parcels; 
};

export const userServices = {
    sendParcel,
    getParcelsBySender,
    cancelParcel,
    getReceiverParcels
}