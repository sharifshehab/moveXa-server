import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { Parcel } from "../parcel/parcel.model";

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



export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
};
