import { AuthController } from "../controller/auth.controller";
import validate from "../middleware/validate";
import { LoginRequestSchema, RegisterRequestSchema } from "./validation/user";
import { Route } from ".";
import { authorizeUser } from "../middleware/authorizeUser";
import { authorizeTempHash } from "../middleware/authorizeTempHash";
import { ParcelController } from "../controller/parcel.controller";

const authController = new AuthController;
const parcelController = ParcelController.getInstance();

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
    },
    {
        name: 'Get temporary hash to redirect meta store',
        method: 'get',
        path: '/api/temp_hash',
        middleware: [authorizeUser()],
        handler: authController.getTempHash
    },
    {
        name: 'Buy Parcel',
        method: 'put',
        path: '/api/parcel/buy',
        middleware: [authorizeTempHash()],
        handler: parcelController.buy
    }
]
export default routes;