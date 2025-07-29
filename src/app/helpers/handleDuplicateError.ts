import { TGenericErrorResponse } from "../interfaces/error.types";

// Handle duplicate key errors from MongoDB (e.g., email already exists)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/); 
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    };
};