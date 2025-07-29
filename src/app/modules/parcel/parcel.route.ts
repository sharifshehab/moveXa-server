import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { sendParcelZodSchema } from "./parcel.validation";
import { senderController } from "./parcel.controller";

export const parcelRoutes = Router();

parcelRoutes.post('/send-parcel', validateRequest(sendParcelZodSchema), senderController.sendParcel);