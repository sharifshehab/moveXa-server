import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { sendParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

export const parcelRoutes = Router();

parcelRoutes.get('/all-parcels', parcelController.getAllParcels);
parcelRoutes.post('/send-parcel', validateRequest(sendParcelZodSchema), parcelController.sendParcel);
parcelRoutes.get('/sender-parcels/:senderId',  parcelController.getParcelsBySender);
parcelRoutes.get('/receiver-parcels/:receiverEmail',  parcelController.getReceiverParcels);
parcelRoutes.patch('/cancel-parcel/:parcelId', parcelController.cancelParcel);
parcelRoutes.patch('/receive-parcel/:parcelId', parcelController.parcelReceived);
parcelRoutes.get('/delivery-history/:receiverEmail', parcelController.getDeliveryHistory);
parcelRoutes.patch('/parcel-status/:parcelId', parcelController.changeParcelStatus);