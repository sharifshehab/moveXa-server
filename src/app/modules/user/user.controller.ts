import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {StatusCodes} from 'http-status-codes';
import { userServices } from "./user.service";
import { Role, Status } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";


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

 /* Super Admin & Admin controllers */
// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { role } = req.query;
    const allUsers = await userServices.getAllUsers(role as Role);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "All Users Retrieved Successfully",
        data: allUsers,
    })
});
// Change user status
const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { userId } = req.params;
    const {  userStatus } = req.body;
    const user = await userServices.changeUserStatus(userId, userStatus as Status, decodedToken as JwtPayload);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "User Status Changed Successfully",
        data: user,
    })
});

 /* Super Admin route */
// Change user Role
const changeUserRole = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user; 
    const { userId } = req.params;
    const user = await userServices.changeUserRole(userId, decodedToken as JwtPayload);  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,     
        message: "User Role Changed Successfully",
        data: user,
    })
});


export const userController = {
    createUser,
    getAllUsers,
    changeUserStatus,
    changeUserRole
};

