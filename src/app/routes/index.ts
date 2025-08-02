import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { parcelRoutes } from "../modules/parcel/parcel.route";
import { deleteRoutes } from "../modules/deletetation/delete.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { paymentLinkRoutes } from "../modules/paymentLink/paymentLink.route";

export const routes = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/parcel",
        route: parcelRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    },
    {
        path: "/payment-link",
        route: paymentLinkRoutes
    },
    {
        path: "/delete",
        route: deleteRoutes
    }
]

moduleRoutes.forEach((route) => {
    routes.use(route.path, route.route)
});