import { model, Schema } from "mongoose";
import { IUser, Role, Status } from "./user.interface";

const userSchema = new Schema<IUser>(
{
name: {
type: String,   
required: [true, 'Please provide user name'],
},
email: {
    type: String,         
    required: true,     
    immutable: true,  
    unique: true,     
    lowercase: true, 
},
password: {
    type: String,   
    required: [true, 'Please provide a password'],
},
role: {
    type: String, 
    enum: {
        values:Object.values(Role),
        message: 'User role not supported, got {VALUE}'
    }
},
status: {
    type: String, 
    enum: {
        values:Object.values(Status),
        message: 'User status not supported, got {VALUE}'
    },
    default: Status.ACTIVE
}
},
    {
        versionKey: false,
        timestamps: true
    }
);
export const User = model<IUser>('User', userSchema);
                    