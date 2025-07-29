import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { feeCalculator } from "../../utils/feeCalculator";

const sendParcelService = async (payload: Partial<IParcel> & { insideDhaka: boolean}) => {  
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
    // Calculate fee
    const fee = feeCalculator(Number(weight), insideDhaka);

    const parcel = await Parcel.create({...payload, fee, trackingID});
    return parcel;
};

export const senderServices = {
    sendParcelService,

}