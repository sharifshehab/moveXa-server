import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { IPaymentLink } from "./paymentLink.interface";
import { PaymentLink } from "./paymentLink.model";
import { Parcel } from "../parcel/parcel.model";


// Create payment link
const createPaymentLink = async (payload: IPaymentLink) => {  
    // Checking
    const parcel = await Parcel.findById(payload.parcelId);
    if (parcel) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Parcel Already Exist");   
    }
    const paymentLink = await PaymentLink.create(payload);
    return paymentLink
};


// Get payment link
const getPaymentLink = async (parcelId:string, decodedToken: JwtPayload) => {
    // Checking
    const paymentLink = await PaymentLink.findOne({parcelId});
    if (!paymentLink) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Payment link not found");   
    }
    if (paymentLink.senderId.toString() !== decodedToken.userId) {
        throw new AppError(StatusCodes.FORBIDDEN, "This parcel is not yours!");   
    }
    return paymentLink;
};


export const paymentLinkServices = {
    createPaymentLink,
    getPaymentLink
}