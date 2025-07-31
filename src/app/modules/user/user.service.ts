import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role, Status } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// Create user
const createUser = async (payload: IUser) => {  
    const { email, password, role } = payload;
    // Checking
    if (role === Role.ADMIN) {
        throw new AppError(StatusCodes.BAD_REQUEST, `You cannot assign ${Role.ADMIN} role`);   
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");   
    }
    
    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND)); 

    const user = await User.create({ ...payload, password: hashedPassword });
    return user
};

 /* Super Admin & Admin services */
// Get all users 
const getAllUsers = async () => {  
    const users = await User.find({email: { $ne: "super@gmail.com" }}); // Exclude "Super Admin" data
    return users;
};
// Change user status 
const changeUserStatus = async (userId: string, userStatus: Status) => {  
    
    const user = await User.findById(userId);
    // Checking 
    if (!user) { 
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    if (userStatus === user.status) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `User is already ${userStatus}`);   
    }

    user.status = userStatus
    await user.save()
    return user
};

/* Super Admin service */
// Change user role 
const changeUserRole = async (userId: string, decodedToken: JwtPayload) => {  
    if (decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(StatusCodes.NOT_FOUND, "You are not permitted to do this operation");  
    }
    const user = await User.findById(userId);
    // Checking
    if (!user) { 
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");   
    }
    if (user.status === Status.BLOCKED) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `This user is ${Status.BLOCKED}`);   
    }
    if (user.role === Role.ADMIN) { 
        throw new AppError(StatusCodes.BAD_REQUEST, `This user is already ${Role.ADMIN}`);   
    }

    user.role = Role.ADMIN
    await user.save()
    return user
};

export const userServices = {
    createUser,
    getAllUsers,
    changeUserStatus,
    changeUserRole
}