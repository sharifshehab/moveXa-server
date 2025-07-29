import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { UserServices } from "./user.service";



const createUser = catchAsync(async (req: Request, res: Response) => {

    const user = await UserServices.createUserService(req.body);  

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "User Created Successfully",
        data: user,
    })
});


export const userController = {
    createUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser
};