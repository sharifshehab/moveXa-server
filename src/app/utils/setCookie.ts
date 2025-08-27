import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

// save the "Both Token's" on client-side in the "cookies"
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {

    // save the "Access Token" on client-side in the "cookies"
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            // secure: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
    }

    // save the "Refresh Token" on client-side in the "cookies"
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            // secure: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
    }
}
