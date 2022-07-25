import { Schema } from "express-validator";

export const LoginRequestSchema: Schema = {
    email: {
        in: ['body'],
        isEmail: true
    },
    password: {
        in: ['body']
    }
}
export const RegisterRequestSchema: Schema = {
    ...LoginRequestSchema,
    username: {
        in: ['body']
    }
}