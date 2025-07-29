
export interface TErrorSources {
    path: string;      
    message: string;   
}

// Return type of error response
export interface TGenericErrorResponse {
    statusCode: number;           
    message: string;            
    errorSources?: TErrorSources[]; 
}