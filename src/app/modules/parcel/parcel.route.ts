import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { sendParcelZodSchema } from "./parcel.validation";
import { userController } from "./parcel.controller";

export const parcelRoutes = Router();

parcelRoutes.post('/send-parcel', validateRequest(sendParcelZodSchema), userController.sendParcel);
parcelRoutes.get('/sender-parcels/:senderId',  userController.getParcelsBySender);
parcelRoutes.get('/receiver-parcels/:receiverEmail',  userController.getReceiverParcels);
parcelRoutes.patch('/cancel-parcel/:parcelId',  userController.cancelParcel);
parcelRoutes.patch('/receive-parcel/:parcelId',  userController.parcelReceived);
parcelRoutes.get('/delivery-history/:receiverEmail',  userController.getDeliveryHistory);