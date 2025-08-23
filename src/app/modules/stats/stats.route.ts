import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsController } from "./stats.controller";

export const statsRoutes = Router();
statsRoutes.get("/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getUserStats);         // user stats
statsRoutes.get("/parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getParcelStats);    // parcel stats
statsRoutes.get("/payments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), statsController.getPaymentStats); // payment stats
