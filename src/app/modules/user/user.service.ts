import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser, Status } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Get all users 
const getAllUsers = async () => {  
    const users = await User.find({});
    return users;
};

// Create user
const createUser = async (payload: IUser) => {  
    const { email, password } = payload;
    // Checking is user already exist
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");   
    }
    
    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND)); 

    const user = await User.create({ ...payload, password: hashedPassword });
    return user
};

// Change user status 
const changeUserStatus = async (userId: string, userStatus: Status, decodedToken: JwtPayload) => {  
    
    const isUserExist = await User.findById(userId);
    if (userId !==decodedToken.userId || isUserExist?.email !== decodedToken.email || isUserExist?.role !== decodedToken.role) {
        throw new AppError(StatusCodes.NOT_FOUND, "You are not permitted to do this operation");  
    }
    // Checking is user exist
    if (!isUserExist) { 
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    
    if (userStatus === isUserExist.status) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `User is already ${userStatus}`);   
    }

    const user = await User.findByIdAndUpdate(userId, { status: userStatus}, { new: true, runValidators: true });
    return user
};

export const userServices = {
    getAllUsers,
    createUser,
    changeUserStatus
}