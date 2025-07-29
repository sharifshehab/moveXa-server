import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { feeCalculator } from "../../utils/feeCalculator";

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

    const parcel = await Parcel.find({senderID: senderId});
    return parcel; 
};

export const senderServices = {
    sendParcel,
    getParcelsBySender
}