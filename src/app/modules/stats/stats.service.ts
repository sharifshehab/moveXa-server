import { Parcel } from "../parcel/parcel.model";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";

// user stats
const getUserStats = async () => {

    const usersByRole = User.aggregate([
        {
            $match: {
                role: { $ne: "Super_Admin" }
            }
        },
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])
    const usersByStatus = User.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const [totalUsers, userByRole, userByStatus] = await Promise.all([
        User.countDocuments(),
        usersByRole,
        usersByStatus

    ])
    return {
        totalUsers,
        userByRole,
        userByStatus,
    };
};

// parcel stats
const getParcelStats = async () => {

    const parcelsByStatus = Parcel.aggregate([
        {
            $group: {
                _id: "$currentStatus",
                count: { $sum: 1 }
            }
        }
    ]);

    const [totalParcel, parcelByStatus] = await Promise.all([
        Parcel.countDocuments(),
        parcelsByStatus,

    ])
    return {
        totalParcel,
        parcelByStatus
    };
};

// payment stats
const getPaymentStats = async () => {

    const paymentsByStatus = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const [totalPayment, paymentByStatus] = await Promise.all([
        Payment.countDocuments(),
        paymentsByStatus,

    ])
    return {
        totalPayment,
        paymentByStatus
    };
};


export const statsServices = {
    getUserStats,
    getParcelStats,
    getPaymentStats
}