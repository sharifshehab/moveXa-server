import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";

export const userRoutes = Router();

userRoutes.get('/all-users', userController.getAllUsers);
userRoutes.post('/register', validateRequest(createUserZodSchema), userController.createUser);
userRoutes.patch('/user-status/:userId', userController.changeUserStatus);