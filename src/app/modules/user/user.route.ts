import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

export const userRoutes = Router();
                                /* remove the "RECEIVER" */
userRoutes.get('/all-users', checkAuth(Role.RECEIVER, Role.ADMIN), userController.getAllUsers);  // Get all users
userRoutes.post('/register', validateRequest(createUserZodSchema), userController.createUser);  // Create user
                                            /* remove the "RECEIVER" */
userRoutes.patch('/user-status/:userId', checkAuth(Role.RECEIVER, Role.ADMIN), userController.changeUserStatus); // Change user status
