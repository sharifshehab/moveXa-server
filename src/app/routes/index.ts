import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { parcelRoutes } from "../modules/parcel/parcel.route";
import { deleteRoutes } from "../modules/deletetation/delete.route";

export const routes = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/parcel",
        route: parcelRoutes
    },
    {
        path: "/delete",
        route: deleteRoutes
    }
]

moduleRoutes.forEach((route) => {
    routes.use(route.path, route.route)
});