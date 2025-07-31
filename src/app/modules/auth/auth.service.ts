import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

//------------> Generate a new "Access_token" for the user using the "Refresh_token":
const getNewAccessTokenService = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}

export const AuthServices = {
    getNewAccessTokenService,
}