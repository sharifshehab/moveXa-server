import { Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"


//------------>Log-In "API": Getting login user info, JWT "Access_token" and a "Refresh_token"
const credentialsLogin = catchAsync(async (req: Request, res: Response) => {

    // User login-info is send to this function as argument, and getting 2-token's and the user info (E.g: _id, name, photo, role, etc...) from it.
    const loginInfo = await AuthServices.credentialsLoginService(req.body);

   // loginInfo = { accessToken, refreshToken, user }

  /* Both token's will have these data of the "Logged In" user: { userId, email, role */

    // save both the "Access Token" and "Refresh Token" on client-side, when user "Logged In"
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
});


// Class: L2--> 28--1-5
//------------> Generate a new "Access_token" for the user using the "Refresh_token" saved on the client_side with this "API"
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;  // Retrieve the "Refresh_token" from the client side
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies")
    }

    // Sending the "Refresh Token" to this function, and getting a new "Access Token"
    const tokenInfo = await AuthServices.getNewAccessTokenService(refreshToken as string);

    // save the new "Access Token" on client-side
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}