import { Types } from "mongoose";

export interface ISSLCommerz {
    parcelId: Types.ObjectId;
    transactionId: string;
    name: string,
    email: string,
    address: string
    amount: number;
}