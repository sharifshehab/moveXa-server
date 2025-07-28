import app from "./app";
import {Server} from "http";
import {envVars} from "./config/env";
import mongoose from "mongoose";

let server: Server;

async function startServer() {
                    try {
                        // Connect to MongoDB Atlas using Mongoose

                        const uri = envVars.DB_URL
                        await mongoose.connect(uri);
                        console.log('Connected to MongoDB Atlas Using Mongoose');
                        
                        server = app.listen(envVars.PORT, () => {
                        console.log(`Server Running on port ${envVars.PORT}`);
                        });

                    } catch (error) {
                        console.error('Error:', error);
                    }
                    }
startServer();
                    
process.on("SIGTERM", () => {
            console.log("SIGTERM signal received... Server shutting down..");
            if (server) {
            server.close(() => {
                process.exit(1)
            });
            }
            process.exit(1)
});
            
// If we manually turn-off the server
process.on("SIGINT", () => {
            console.log("SIGINT signal received... Server shutting down..");
            if (server) {
            server.close(() => {
                process.exit(1)
            });
            }
            process.exit(1)
})

// Unhandled rejection
process.on("unhandledRejection", (err) => {
            console.log("Unhandled Rejection detected... Server shutting down..", err);
            if (server) {
            server.close(() => {
                process.exit(1)
            });
            }
            process.exit(1)
});

// Uncaught rejection
process.on("uncaughtException", (err) => {
            console.log("Uncaught Exception detected... Server shutting down..", err);
            if (server) {
            server.close(() => {
                process.exit(1)
            });
            }
            process.exit(1)
});