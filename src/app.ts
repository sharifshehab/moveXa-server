import dotenv from 'dotenv';
import express, {Application, Request, Response, NextFunction} from 'express'
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();
const app: Application = express();

// app.use(cors({
//     origin: envVars.FRONTEND_URL,
//     credentials: true
// }))
app.use(express.json());

// Main route
app.get('/', (req: Request, res: Response) => {
            res.send('Welcome to Movexa Server')
});

// Global Error Handler
// app.use(globalErrorHandler);

// Error handler for 404 route
// app.use(notFound);
export default app;