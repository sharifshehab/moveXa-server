import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { sendParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const parcelRoutes = Router();

/* Open route for all logged_in users */
parcelRoutes.get('/track-parcel/:trackingID', parcelController.trackParcel); // Get parcel status with tracking_Id

/* Super Admin & Admin route */
parcelRoutes.get('/all-parcels', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), parcelController.getAllParcels); // Get all parcels

/* Sender routes */
parcelRoutes.post('/send-parcel', checkAuth(Role.SENDER), validateRequest(sendParcelZodSchema), parcelController.sendParcel); // Send parcel
parcelRoutes.get('/sender-parcels/:senderId', checkAuth(Role.SENDER), parcelController.getParcelsBySender);                  // Get all the parcel send by a user (i.e., user = SENDER)
parcelRoutes.patch('/cancel/:parcelId', checkAuth(Role.SENDER), parcelController.cancelParcel);                             // Cancel parcel by user (i.e., user = SENDER)

/* Receiver routes */
parcelRoutes.get('/receiver-parcels/:receiverEmail', checkAuth(Role.RECEIVER), parcelController.getReceiverParcels);      // Get all parcels send for a receiver  
parcelRoutes.patch('/parcel-received/:parcelId', checkAuth(Role.RECEIVER), parcelController.parcelReceived);             // Confirm parcel received by the user (i.e., user = RECEIVER)
parcelRoutes.get('/delivery-history/:receiverEmail', checkAuth(Role.RECEIVER), parcelController.getDeliveryHistory);    // Parcel delivery history

/* Super Admin & Admin route */
parcelRoutes.patch('/parcel-status/:parcelId', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), parcelController.changeParcelStatus);  // Change parcel status
/* Super Admin */
parcelRoutes.patch('/approve-parcel/:parcelId', checkAuth(Role.SUPER_ADMIN), parcelController.approveParcel);                 // Approve parcel 
