import { Router } from "express";
import { paymentLinkController } from "./paymentLink.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const paymentLinkRoutes = Router();

paymentLinkRoutes.get('/link/:parcelId', checkAuth(Role.SENDER), paymentLinkController.getPaymentLink);  // Get payment link