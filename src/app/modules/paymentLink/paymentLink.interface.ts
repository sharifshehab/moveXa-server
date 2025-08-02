import { Types } from "mongoose";

export interface IPaymentLink {
    parcelId: Types.ObjectId;
    senderId: Types.ObjectId;
    paymentLink: string;
};