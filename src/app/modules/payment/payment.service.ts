/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { Parcel } from "../parcel/parcel.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const successPayment = async (query: Record<string, string>) => {
    const session = await Parcel.startSession();
    session.startTransaction()

    try {
        const payload = { ...query, status: PAYMENT_STATUS.PAID }
        const [createPayment] = await Payment.create([payload], { session })
        if (!createPayment) {
            throw new AppError(401, "Payment not found")
        }

        await Parcel.findByIdAndUpdate(createPayment?.parcelId, { payment: PAYMENT_STATUS.PAID }, { runValidators: true, session }); // updated Parcel

        await session.commitTransaction();
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};

const failPayment = async (query: Record<string, string>) => {
    const session = await Parcel.startSession();
    session.startTransaction()

    try {
        const payload = { ...query, status: PAYMENT_STATUS.FAILED }
        const [createPayment] = await Payment.create([payload], { session })
        if (!createPayment) {
            throw new AppError(401, "Payment not found")
        }

        await Parcel.findByIdAndUpdate(createPayment?.parcelId, { payment: PAYMENT_STATUS.FAILED }, { runValidators: true, session }); // updated Parcel

        await session.commitTransaction();
        session.endSession()
        return { success: false, message: "Payment Failed" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    const session = await Parcel.startSession();
    session.startTransaction()

    try {
        const payload = { ...query, status: PAYMENT_STATUS.CANCELLED }
        const [createPayment] = await Payment.create([payload], { session })
        if (!createPayment) {
            throw new AppError(401, "Payment not found")
        }

        await Parcel.findByIdAndUpdate(createPayment?.parcelId, { payment: PAYMENT_STATUS.CANCELLED }, { runValidators: true, session }); // updated Parcel

        await session.commitTransaction();
        session.endSession()
        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        throw error
    }
};

const initPayment = async (parcelID: string) => {

    const parcel = await Parcel.findById(parcelID).populate("senderID", "name email");
    if (!parcel) {
        throw new AppError(401, "Parcel Not Found.");
    }
    const senderName = (parcel?.senderID as any).name
    const senderEmail = (parcel?.senderID as any).email

    const sslPayload: ISSLCommerz = {
        parcelId: parcel._id,
        transactionId: parcel.trackingID,
        name: senderName,
        email: senderEmail,
        address: parcel.senderAddress as string,
        amount: parcel.fee,
    }

    // Create payment URL
    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};



export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};
