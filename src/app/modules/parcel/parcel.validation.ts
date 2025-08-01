import z from "zod";
import { ParcelStatus, ParcelType } from "./parcel.interface";


const statusLogZodSchema = z.object({
    status: z.enum(ParcelStatus),
    timestamp: z.date(),
    updatedBy: z.string(),
});

export const sendParcelZodSchema = z.object({
    trackingID: z.string().optional(),
    senderID: z.string(),
    receiverEmail: z.email(),
    senderAddress: z.string(),
    receiverAddress: z.string(),
    weight: z.number().positive(),
    type: z.enum(ParcelType),
    insideDhaka: z.boolean(),
    fee: z.number().optional(),
    isApproved: z.boolean().optional(),
    currentStatus: z.enum(ParcelStatus).optional(),
    statusLog: z.array(statusLogZodSchema).optional(),
});

