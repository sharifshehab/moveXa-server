import dotenv from 'dotenv';
import express, {Application, Request, Response} from 'express'
import cors from 'cors';
import cookieParser from "cookie-parser";
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { routes } from './app/routes';
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport";
import { envVars } from './app/config/env';

dotenv.config();
const app: Application = express();

app.set("trust proxy", 1);
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use(expressSession({
        secret: envVars.EXPRESS_SESSION_SECRET,  
        resave: false,                          
        saveUninitialized: false              
    }));
app.use(passport.initialize());
app.use(passport.session());

// All the API routes
app.use("/api/v1", routes);

// Main route
app.get('/', (req: Request, res: Response) => {
            res.send('Welcome to MoveXa Server')
});

// Global Error Handler
app.use(globalErrorHandler);

// Error handler for 404 route
app.use(notFound);

export default app;