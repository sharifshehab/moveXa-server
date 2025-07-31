export enum Status {
    ACTIVE = "Active",
    BLOCKED = "Blocked"
}
export enum Role {
    SUPER_ADMIN = "Super_Admin",
    ADMIN = "Admin",
    SENDER = "Sender",
    RECEIVER = "Receiver"
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
};