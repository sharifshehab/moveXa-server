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

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }
        
        // Calling token verifying function
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

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
        next()

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }

}
