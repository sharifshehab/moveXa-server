/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { feeCalculator } from "../../utils/feeCalculator";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Role, Status } from "../user/user.interface";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { PaymentLink } from "../paymentLink/paymentLink.model";
import { IPaymentLink } from "../paymentLink/paymentLink.interface";


// Track Parcel
const trackParcel = async (trackingID: string) => {  
    const parcelStatus = await Parcel.aggregate([
        {
            $match: {
                trackingID: trackingID,
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
                receiverName: '$receiverDetails.name',
                weight: 1,
                parcelType: '$type',
                deliveryFee: '$fee',
                statusHistory: '$statusLog'
            }
        },
    ])
    return parcelStatus; 
};

 /* SENDER API services */
// Send parcel to a user (i.e., user = RECEIVER)
const sendParcel = async (payload: Partial<IParcel> & { insideDhaka: boolean }) => {  

        const { senderID, senderAddress, receiverEmail, weight, insideDhaka } = payload;
        if (!senderID) {
            throw new AppError(StatusCodes.NOT_FOUND, "Sender Id is required");   
        }


        // Checking sender
        const sender = await User.findById(senderID);
        if (!sender) {
            throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
        }
        if (sender?.status === Status.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, `User is blocked`);   
        }
        // Checking receiver 
        const receiver = await User.findOne({email: receiverEmail});
        if (!receiver) {
            throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");   
        }
        if (receiver?.status === Status.BLOCKED) {
            throw new AppError(StatusCodes.BAD_REQUEST, `Receiver is blocked`);   
        }

        // Generate tracking_Id
        const trackingID = generateTrackingId();
        // Calculate parcel fee
        const fee = feeCalculator(weight as number, insideDhaka);
        // Sender status log
        const statusLog = {
            status: ParcelStatus.REQUESTED,
            timestamp: new Date(),
            updatedBy: Types.ObjectId.createFromHexString(senderID.toString()) 
        }
        const createParcel = await Parcel.create({ ...payload, statusLog, fee, trackingID } );
        const parcel = await Parcel.findById(createParcel._id).populate("senderID", "name email");
        const senderName = (parcel?.senderID as any).name
        const senderEmail = (parcel?.senderID as any).email

        const sslPayload: ISSLCommerz = {
            parcelId: createParcel._id,
            transactionId: trackingID,
            name: senderName,
            email: senderEmail,
            address: senderAddress as string,
            amount: fee,
        }
        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        const paymentLinkPayload: IPaymentLink = {
            parcelId: createParcel._id,
            senderId: senderID,
            paymentLink: sslPayment.GatewayPageURL
        }
        await PaymentLink.create(paymentLinkPayload); // create payment link

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            parcel: createParcel
        };
};
// Get all parcels send by a user (i.e., user = SENDER)
const getParcelsBySender = async (senderId: string, decodedToken: JwtPayload) => {
    
    // Checking
    const user = await User.findById(senderId);
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    if (senderId !== decodedToken.userId || user.role !== Role.SENDER) {
        throw new AppError(StatusCodes.NOT_FOUND, "You are not permitted to do this operation");  
    }
    if (user?.status === Status.BLOCKED) {
        throw new AppError(StatusCodes.BAD_REQUEST, `User is blocked`);   
    }

    const parcels = await Parcel.find({senderID: senderId});
    return parcels; 
};
// Cancel Parcel 
const cancelParcel = async (parcelId: string, decodedToken: JwtPayload) => {  

    // Checking
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (parcel.senderID.toString() !== decodedToken.userId) {
        throw new AppError(StatusCodes.FORBIDDEN, "This parcel is not yours!");   
    }
    if (parcel.currentStatus === ParcelStatus.DISPATCHED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel has already been dispatched, cannot be cancelled now!");   
    }
    if (parcel.currentStatus === ParcelStatus.BLOCKED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is blocked");   
    }
    if (parcel.currentStatus === ParcelStatus.CANCELLED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel has already been cancelled!");   
    }

    parcel.currentStatus = ParcelStatus.CANCELLED;
    parcel.statusLog.push({
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: Types.ObjectId.createFromHexString(decodedToken.userId.toString()) 
    });
    await parcel.save();
    return parcel; 
};


 /* RECEIVER API services */
// Get all parcels send for a receiver 
const getReceiverParcels = async (receiverEmail: string, decodedToken: JwtPayload) => {  

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");   
    }
    if (receiverEmail !== decodedToken.email || receiver.role !== Role.RECEIVER) {
        throw new AppError(StatusCodes.NOT_FOUND, "You are not permitted to do this operation");  
    }
    if (receiver?.status === Status.BLOCKED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Receiver is blocked");   
    }

    const parcels = await Parcel.find({receiverEmail});
    return parcels; 
};
// Confirm parcel received by the user (i.e., user = RECEIVER)
const parcelReceived = async (parcelId: string, receiveParcel:boolean, decodedToken: JwtPayload) => {  

    // Checking
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (decodedToken.role !== Role.RECEIVER) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not permitted to do this operation");  
    }
    if (parcel.receiverEmail !== decodedToken.email) {
        throw new AppError(StatusCodes.FORBIDDEN, "This parcel is not yours!");   
    }
    if (parcel.currentStatus === ParcelStatus.BLOCKED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel is blocked");   
    }
    if (parcel.currentStatus === ParcelStatus.CANCELLED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel was cancelled");   
    }
    if (parcel.currentStatus === ParcelStatus.RECEIVED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel has already been received");   
    }

    if (parcel.currentStatus === "DELIVERED") {
        if (receiveParcel) {
            parcel.currentStatus = ParcelStatus.RECEIVED;
            parcel.statusLog.push({
                status: ParcelStatus.RECEIVED,
                timestamp: new Date(),
                updatedBy: Types.ObjectId.createFromHexString(decodedToken.userId.toString()) 
            });
            await parcel.save();
            return parcel; 
        } else {
            parcel.currentStatus = ParcelStatus.RETURNED;
            parcel.statusLog.push({
                status: ParcelStatus.RETURNED,
                timestamp: new Date(),
                updatedBy: Types.ObjectId.createFromHexString(decodedToken.userId.toString()) 
            });
            await parcel.save();
            return parcel; 
        }
    } else {
        return null;
    }
};
// Parcel Delivery history
const getDeliveryHistory = async (receiverEmail: string, decodedToken: JwtPayload) => {  

    if (receiverEmail !== decodedToken.email || decodedToken.role !== Role.RECEIVER) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not permitted to do this operation");  
    }
    
    const deliveries = await Parcel.aggregate([
        {
            $match: {
                receiverEmail,
                currentStatus: { $in: ["RECEIVED", "RETURNED"]}
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
                statusHistory: '$statusLog'
            }
        },
    ])
    return deliveries; 
};

 /* Super Admin & Admin service */
// Get all parcels
const getAllParcels = async (parcelStatus: ParcelStatus) => {  
    let filter = {}
    if (parcelStatus) {
        filter = {currentStatus: parcelStatus}
    }
    const parcels = await Parcel.find(filter);
    return parcels;
};
// Change parcel status
const changeParcelStatus = async (parcelId: string, parcelStatus: ParcelStatus, decodedToken: JwtPayload) => {  
    // Checking 
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) { 
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (!parcel.isApproved) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `Parcel is not approved yet.`);   
    }
    if ([ParcelStatus.RECEIVED, ParcelStatus.RETURNED].includes(parcelStatus)) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `You cannot assign ${parcelStatus} status for the Parcel`);   
    }
    if (parcel.currentStatus === parcelStatus) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `Parcel status is already ${parcelStatus}`);   
    }
    
    parcel.currentStatus = parcelStatus;
    parcel.statusLog.push({
        status: parcelStatus,
        timestamp: new Date(),
        updatedBy: Types.ObjectId.createFromHexString(decodedToken.userId.toString()) 
    });

    await parcel.save()
    return parcel;
};

/* Super Admin service */
// Approve parcel
const approveParcel = async (parcelId: string, decodedToken: JwtPayload) => { 
    if (decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(StatusCodes.NOT_FOUND, "You are not permitted to do this operation");  
    }
    // Checking 
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) { 
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");   
    }
    if (parcel.payment !== PAYMENT_STATUS.PAID) { 
        throw new AppError(StatusCodes.NOT_FOUND, `Payment ${parcel.payment}`);   
    }

    parcel.isApproved = true;
    await parcel.save();
    return parcel;
};

export const parcelServices = {
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
}