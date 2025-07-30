import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";
import { Status } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization; // Receiving the token from the client-side

        // This will be used: const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }
        
        // Calling token verifying function, and getting the user data
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        // verifiedToken = { userId, email, role }

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if (isUserExist.status === Status.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${Status.BLOCKED}`)
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        req.user = verifiedToken
        /*
            Assigning the token-data to "req.user" (custom added), similar to how we use "req.body" or "req.params" to access any data.
            Now, on any route where "checkAuth" middleware is used, I can access the token-data using "req.user"
        */
        next()

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }

}
