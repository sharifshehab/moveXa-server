import bcrypt from "bcryptjs";
// import { envVars } from "../../config/env";
// import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import {StatusCodes} from 'http-status-codes';


//------------> For generating login user info, JWT "Access_token" and a "Refresh_token" [ Don't need this if using Passport-Email&Password method ]
const credentialsLoginService = async (payload: Partial<IUser>) => {
    const { email, password } = payload;  // User login "email and password"

    const isUserExist = await User.findOne({ email }); // Checking if user has "Registered". Register user data will be on the Database!
    if (!isUserExist) {
        throw new Error("Email does not exist");
    }
    
    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string);  // Checking, is the provided password matches the encrypted password saved in the database.
    if (!isPasswordMatched) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password")
    }

    // If user exists we will generate a "access_token" and a "refresh_token" for the user with this function
    const userTokens = createUserTokens(isUserExist);
    

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();  // Send user data after login, without the password
                      /* "toObject" = convert login user data, to object  */
    return {
        accessToken: userTokens.accessToken,    // Access Token
        refreshToken: userTokens.refreshToken, // Refresh Token
        user: rest // (E.g: _id, name, photo, role, etc...)
    }
};


//------------> For generate a new "Access_token" for the user using the "Refresh_token" saved on the client_side
const getNewAccessTokenService = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

export const AuthServices = {
    credentialsLoginService,
    getNewAccessTokenService,
}