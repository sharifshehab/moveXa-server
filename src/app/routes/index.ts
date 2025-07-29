import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { parcelRoutes } from "../modules/parcel/parcel.route";

export const routes = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/parcel",
        route: parcelRoutes
    }
]

moduleRoutes.forEach((route) => {
    routes.use(route.path, route.route)
});