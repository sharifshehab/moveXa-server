import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";

// Handle errors where a MongoDB "ObjectId" is invalid (e.g., malformed _id)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    };
};