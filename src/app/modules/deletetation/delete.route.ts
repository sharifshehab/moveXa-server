import { Router } from "express";
import { deleteController } from "./delete.controller";

export const deleteRoutes = Router();

deleteRoutes.delete('/delete-data',  deleteController.deleteData);