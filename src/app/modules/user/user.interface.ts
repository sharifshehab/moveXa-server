export enum Status {
    ACTIVE = "Active",
    BLOCKED = "Blocked"
}
export enum Role {
    ADMIN = "Admin",
    SENDER = "Sender",
    RECEIVER = "Receiver"
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
};