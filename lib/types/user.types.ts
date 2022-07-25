export interface LoginRequest {
    email: string,
    password: string
}
export interface RegisterRequest extends LoginRequest {
    username: string
}