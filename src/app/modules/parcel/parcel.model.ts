import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, ParcelStatus, ParcelType } from "./parcel.interface";
import { PAYMENT_STATUS } from "../payment/payment.interface";

// Embedded
const statusLogSchema = new Schema<IStatusLog>(
    {
        status: {
                type: String,   
                enum: Object.values(ParcelStatus),
                required: true,
            },
        timestamp: {
                type: Date,   
                required: true,
                default: Date.now,
            },
        updatedBy: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
    },
    {
        _id: false,
        versionKey: false,
    }
);


const parcelSchema = new Schema<IParcel>(
{
trackingID: {
    type: String,   
        required: true,
        unique: true
},
senderID: {
    type: Schema.Types.ObjectId,   
    ref: "User",
    required: true,
},
receiverEmail: {
    type: String,   
    required: [true, 'Please provide receiver email']
},
senderAddress: {
    type: String,   
    required: [true, 'Please provide sender address']
},
receiverAddress: {
    type: String,   
    required: [true, 'Please provide receiver address']
},
weight: {
    type: Number,         
    required: true     
},
type: {
    type: String, 
    enum: {
        values:Object.values(ParcelType),
        message: 'Parcel type is not supported, got {VALUE}'
    }
},
fee: {
    type: Number,         
    required: true     
},
payment: {
    type: String, 
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.UNPAID   
},
isApproved: {
    type: Boolean,         
    default: false
},
currentStatus: {
    type: String, 
    enum: {
        values:Object.values(ParcelStatus),
        message: 'Parcel status is not supported, got {VALUE}'
    },
    default: ParcelStatus.REQUESTED
},
statusLog: {
    type: [statusLogSchema],         
    required: true
},
},
    {
        versionKey: false,
        timestamps: true
    }
);
export const Parcel = model<IParcel>('Parcel', parcelSchema);
                    