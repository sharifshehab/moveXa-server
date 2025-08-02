import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    parcelId: {
        type: Schema.Types.ObjectId,
        ref: "Parcel",
        required: true,
        unique: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed,
        default: {},
    }
}, {
    versionKey: false,
    timestamps: true
})

export const Payment = model<IPayment>("Payment", paymentSchema)