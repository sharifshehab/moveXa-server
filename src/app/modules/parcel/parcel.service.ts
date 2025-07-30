import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { feeCalculator } from "../../utils/feeCalculator";
import mongoose from "mongoose";


// Get all parcels
const getAllParcels = async () => {  
    const parcels = await Parcel.find({});
    return parcels;
};

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
    if (parcel?.currentStatus === "DISPATCHED") {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already dispatched, cannot be cancelled now!");   
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

// Confirm parcel received by the user (i.e., User = RECEIVER)
const parcelReceived = async (parcelId: string) => {  
    // Checking is parcel blocked
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (parcel?.isBlocked) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is blocked");   
    }
    if (parcel?.isCancelled) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is cancelled");   
    }

    parcel.currentStatus = ParcelStatus.DELIVERED;
    parcel.statusLog.push({
        status: ParcelStatus.DELIVERED,
        timestamp: new Date(),
        updatedBy: new mongoose.Types.ObjectId("6888eae5bc449833ae074f82") // Remove this with the token user id
    });
    await parcel.save();
    return parcel; 
};

// Parcel Delivery history
const getDeliveryHistory = async (receiverEmail: string) => {  
    const deliveries = await Parcel.aggregate([
        {
            $match: {
                receiverEmail,
                currentStatus: "DELIVERED"
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'senderID',
                foreignField: '_id',
                as: 'senderDetails'
            }
        },
        { $unwind: '$senderDetails' },
        {
            $lookup: {
                from: 'users',
                localField: 'receiverEmail',
                foreignField: 'email',
                as: 'receiverDetails'
            }
        },
        { $unwind: '$receiverDetails' },
        {
            $project: {
                _id: 0,
                trackingID: 1,
                senderName: '$senderDetails.name',
                senderEmail: '$senderDetails.email',
                receiverName: '$receiverDetails.name',
                receiverEmail: '$receiverDetails.email',
                sendFrom: '$senderAddress',
                receivedFrom: '$receiverAddress',
                weight: 1,
                parcelType: '$type',
                deliveryFee: '$fee',
                statusLog: {
                    $filter: {
                        input: "$statusLog",
                        as: "log",
                        cond: { $eq: ["$$log.status", "DELIVERED"]}
                    },

                }
            }
        },
        { $unwind: '$statusLog' }
    ])
    return deliveries; 
};

// Change parcel status
const changeParcelStatus = async (parcelId: string, parcelStatus: boolean) => {  
    // Checking is parcel exist
    const isParcelExist = await Parcel.findById(parcelId);
    if (!isParcelExist) { 
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    
    if (parcelStatus === isParcelExist.isBlocked) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `Parcel status is already ${parcelStatus}`);   
    }

    const parcel = await Parcel.findByIdAndUpdate(parcelId, { isBlocked: parcelStatus}, { new: true, runValidators: true });
    return parcel
};

export const parcelServices = {
    getAllParcels,
    sendParcel,
    getParcelsBySender,
    cancelParcel,
    getReceiverParcels,
    parcelReceived,
    getDeliveryHistory,
    changeParcelStatus
}