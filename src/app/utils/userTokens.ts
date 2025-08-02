import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IUser, Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";


// Generate both "Access Token", and "Refresh Token" with this function
export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);     // Calling the the token generator function, to create a access token

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES) // Calling the the JWT token generator function, to create a refresh token

    return {
        accessToken,
        refreshToken
    }
};

// Generate a new "Access_token" for the user using the "Refresh_token" saved on the client_side
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload  // Checking, if token is valid or not

const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

// New "Access_token" will not be generated for these cases
if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
}
if (isUserExist.status === Status.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is blocked`)
}

const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
}
const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)  // New "Access_token" generated

return accessToken
}