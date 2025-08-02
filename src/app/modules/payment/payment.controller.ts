import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";


const successPayment = catchAsync(async (req: Request, res: Response) => {
    /* 
        const query =  {
                        transactionId: trackingID,
                        parcelId: createParcel._id,
                        amount: fee,
            }
    */
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&parcelId=${query.parcelId}&fee=${query.amount}&status=success`);
    }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {

    const query = req.query
    const result = await PaymentService.failPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&parcelId=${query.parcelId}&fee=${query.amount}&status=failed`);
    }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {

    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&parcelId=${query.parcelId}&fee=${query.amount}&status=cancelled`);
    }
});


const validatePayment = catchAsync(
    async (req: Request, res: Response) => {
        console.log("sslcommerz ipn url body", req.body);
        await SSLService.validatePayment(req.body)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    }
);

export const PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    validatePayment
};
