import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";

export const userRoutes = Router();

userRoutes.post('/register', validateRequest(createUserZodSchema), userController.createUser);