import { Router } from "express";
import { AuthControllers } from "./auth.controller";

export const AuthRoutes = Router()

AuthRoutes.post("/login", AuthControllers.credentialsLogin);  // When user login, JWT_token will be created
AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);

