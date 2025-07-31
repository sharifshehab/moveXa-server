import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

// "JWT" token generating function
export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions)
    return token
}

// Token verifying function
export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret); // decrypting the token
    return verifiedToken
}