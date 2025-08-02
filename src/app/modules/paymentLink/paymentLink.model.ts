import { model, Schema } from "mongoose";
import { IPaymentLink } from "./paymentLink.interface";

const paymentLinkSchema = new Schema<IPaymentLink>(
{
parcelId: {
    type: Schema.Types.ObjectId,   
    required: [true, 'Please provide parcel Id'],
},
senderId: {
    type: Schema.Types.ObjectId,   
    required: [true, 'Please provide sender Id'],
},
paymentLink: {
    type: String,         
    required: true,     
    immutable: true,  
    unique: true,    
},
},
    {
        versionKey: false,
        timestamps: true
    }
);
export const PaymentLink = model<IPaymentLink>('PaymentLink', paymentLinkSchema);
                    