import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { userServices } from "./user.service";
import { Status } from "./user.interface";


// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const allUsers = await userServices.getAllUsers();  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "All Users Retrieved Successfully",
        data: allUsers,
    })
});

// Create user
const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.createUser(req.body);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,     
        message: "User Created Successfully",
        data: user,
    })
});

// Change user status
const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const {  userStatus } = req.body;
    const user = await userServices.changeUserStatus(userId, userStatus as Status);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "User Status Changed Successfully",
        data: user,
    })
});


export const userController = {
    getAllUsers,
    createUser,
    changeUserStatus
};

