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
    required: true,     // Email is a required field
    immutable: true,   // Once set, this field cannot be changed
    unique: true,     // Email must be unique in the database
    lowercase: true, // Converts email to lowercase before saving
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
                    