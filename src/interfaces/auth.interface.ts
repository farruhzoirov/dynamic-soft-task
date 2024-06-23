export enum Role {
    super_admin = "super_admin",
    admin = "admin",
    manager = "manager",
    cashier = "cashier"
}


type User = {
    username: string;
    password: string;
}


export interface isAutenticatedUser {
    username: string;
    token: string;
}