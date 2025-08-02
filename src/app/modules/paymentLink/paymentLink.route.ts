import { Router } from "express";
import { paymentLinkController } from "./paymentLink.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const paymentLinkRoutes = Router();

/* We will have to get the payment URL within a few minutes after the parcel is created; otherwise, the payment URL will not work */
paymentLinkRoutes.get('/link/:parcelId', checkAuth(Role.SENDER), paymentLinkController.getPaymentLink);  // Get payment link 