import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

export const userRoutes = Router();

userRoutes.post('/register', validateRequest(createUserZodSchema), userController.createUser);  // Create user

/* Super Admin & Admin routes */
userRoutes.get('/all-users', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), userController.getAllUsers);  // Get all users
userRoutes.patch('/user-status/:userId', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), userController.changeUserStatus); // Change user status

/* Super Admin route */
userRoutes.patch('/assign-admin/:userId', checkAuth(Role.SUPER_ADMIN), userController.changeUserRole); // Change user role
