import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string()
        .min(5, { message: "Name must be at least 5 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z.email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." }),
    role: z.enum(Role),
});

