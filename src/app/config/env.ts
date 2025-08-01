import dotenv from "dotenv";

dotenv.config();
interface EnvConfig {
        PORT: string,
        DB_URL: string,
        NODE_ENV: "development" | "production"
        BCRYPT_SALT_ROUND: string
        JWT_ACCESS_SECRET: string
        JWT_ACCESS_EXPIRES: string
        JWT_REFRESH_SECRET: string
        JWT_REFRESH_EXPIRES: string
        EXPRESS_SESSION_SECRET: string
        SUPER_ADMIN_EMAIL: string
        SUPER_ADMIN_PASSWORD: string
        FRONTEND_URL: string
        SSL: {
            STORE_ID: string,
            STORE_PASS: string,
            SSL_PAYMENT_API: string,
            SSL_VALIDATION_API: string,
            SSL_SUCCESS_FRONTEND_URL: string,
            SSL_FAIL_FRONTEND_URL: string,
            SSL_CANCEL_FRONTEND_URL: string,
            SSL_SUCCESS_BACKEND_URL: string,
            SSL_FAIL_BACKEND_URL: string,
            SSL_CANCEL_BACKEND_URL: string,
            SSL_IPN_URL: string
        }
    }

    const loadEnvVariables = (): EnvConfig => {
        const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "EXPRESS_SESSION_SECRET", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "FRONTEND_URL", "SSL_STORE_ID", "SSL_STORE_PASS",
        "SSL_PAYMENT_API", "SSL_VALIDATION_API", "SSL_SUCCESS_FRONTEND_URL", "SSL_FAIL_FRONTEND_URL", "SSL_CANCEL_FRONTEND_URL", "SSL_SUCCESS_BACKEND_URL", "SSL_FAIL_BACKEND_URL", "SSL_CANCEL_BACKEND_URL", "SSL_IPN_URL"];

        requiredEnvVariables.forEach(key => {
            if (!process.env[key]) {
                throw new Error(`Missing require environment variable ${key}`)
            }
        })

        return {
            PORT: process.env.PORT as string,
            DB_URL: process.env.DB_URL as string,
            NODE_ENV: process.env.NODE_ENV as "development" | "production",
            BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
            EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
            SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
            SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
            FRONTEND_URL: process.env.FRONTEND_URL as string,
            SSL: {
                STORE_ID: process.env.SSL_STORE_ID as string,
                STORE_PASS: process.env.SSL_STORE_PASS as string,
                SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
                SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
                SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
                SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
                SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
                SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
                SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
                SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
                SSL_IPN_URL: process.env.SSL_IPN_URL as string
            }
        }
    }

    export const envVars = loadEnvVariables();