import { User } from "@prisma/client"
import { Request } from "express"

export interface LoginRequest {
    email: string,
    password: string
}
export interface RegisterRequest extends LoginRequest {
    name: string
}

export interface AuthRequest extends Request {
    user: User
}

export interface UserData extends Partial<User> {}