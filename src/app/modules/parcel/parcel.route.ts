import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { sendParcelZodSchema } from "./parcel.validation";
import { senderController } from "./parcel.controller";

export const parcelRoutes = Router();

parcelRoutes.post('/send-parcel', validateRequest(sendParcelZodSchema), senderController.sendParcel);
parcelRoutes.get('/sender-parcels/:senderId',  senderController.getParcelsBySender);
parcelRoutes.get('/receiver-parcels/:receiverEmail',  senderController.getParcelsForReceiver);