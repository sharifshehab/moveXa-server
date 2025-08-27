/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"
import passport from "passport"
import { createUserTokens } from "../../utils/userTokens"


//------------>Log-In:
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
                
    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, err));
        }

        if (!user) {
            return next(new AppError(401, info.message));
        }
        // Generate user "Access Token" and "Refresh Token" 
        const userTokens = createUserTokens(user)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...rest } = user.toObject()
        // save both the "Access Token" and "Refresh Token" on client-side, when user "Logged In"
        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)
});


//------------> Generate a new "Access_token" for the user using the "Refresh_token":
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;  // Retrieve the "Refresh_token" from the client side
    
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received!")
    }

    // Sending the "Refresh Token" to this function, and get a new "Access Token"
    const tokenInfo = await AuthServices.getNewAccessTokenService(refreshToken as string);

    // save the new "Access Token" on client-side
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    })
});

//------------> Log-Out:
const logout = catchAsync(async (req: Request, res: Response) => {

    // Remove "Access Token" from the client-side cookie
    res.clearCookie("accessToken", {
        maxAge: 0,
        httpOnly: true,
        // secure: false,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: "none"
    });

    // Remove "Refresh Token" from the client-side cookie
    res.clearCookie("refreshToken", {
        maxAge: 0,
        httpOnly: true,
        // secure: false,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: "none"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
});


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout
}