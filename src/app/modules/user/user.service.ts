import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../../config/env";

const createUserService = async (payload: IUser) => {  

    const { email, password } = payload;

    // Checking is user already exist
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");   
    }

    // Encrypting password
    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND)); 


    // Create user using: Static Method
    const user = await User.create({ ...payload, password: hashedPassword });
    return user
};

export const UserServices = {
    createUserService,
    // getAllUsersService,
    // getUserByIdService,
    // updateUserService,
    // deleteUserByIdService
}