import { AuthController } from "../controller/auth.controller";
import validate from "../middleware/validate";
import { LoginRequestSchema, RegisterRequestSchema } from "./validation/user";
import { Route } from ".";

const authController = new AuthController;

const routes: Route[] = [
    {
        name: 'Register',
        method: 'post',
        path: '/api/register',
        middleware: [validate(RegisterRequestSchema)],
        handler: authController.register
    },
    {
        name: 'Login',
        method: 'post',
        path: '/api/login',
        middleware: [validate(LoginRequestSchema)],
        handler: authController.login
    }
]
export default routes;