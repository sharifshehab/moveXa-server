import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
    BLOCKED = "BLOCKED"
}
export enum ParcelType {
    DOCUMENT = "DOCUMENT",
    FRAGILE = "FRAGILE",
    CLOTHING = "CLOTHING",
    OTHER = "OTHER"
}
export enum Payment {
    PAID = "PAID",
    UNPAID = "UNPAID"
}

export interface IStatusLog {
    status: ParcelStatus;
    timestamp: Date;
    updatedBy : Types.ObjectId;
}

export interface IParcel {
    trackingID: string;
    senderID: Types.ObjectId;
    // receiverID: Types.ObjectId;
    receiverEmail: string;
    senderAddress: string;
    receiverAddress: string;
    weight: number;
    type: ParcelType;
    fee: number;
    payment: Payment;
    currentStatus: ParcelStatus;
    statusLog:IStatusLog[];
    isBlocked: boolean;
    isCancelled: boolean;
};