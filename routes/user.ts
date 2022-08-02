import { AuthController } from "../controller/auth.controller";
import validate from "../middleware/validate";
import { LoginHashRequestSchema, LoginRequestSchema, RegisterRequestSchema } from "./validation/user";
import { Route } from ".";
import { authorizeUser } from "../middleware/authorizeUser";
import { authorizeTempHash } from "../middleware/authorizeTempHash";
import { ParcelController } from "../controller/parcel.controller";
import { ParcelBuySchema, ParcelRetrieveSchema } from "./validation/parcel";
import { PaymentController } from "../controller/payment.controller";


const routes: Route[] = [
    {
        name: 'Register',
        method: 'post',
        path: '/api/register',
        middleware: [validate(RegisterRequestSchema)],
        handler: AuthController.register
    },
    {
        name: 'Login',
        method: 'post',
        path: '/api/login',
        middleware: [validate(LoginRequestSchema)],
        handler: AuthController.login
    },
    {
        name: 'Login',
        method: 'post',
        path: '/api/login-token',
        middleware: [validate(LoginHashRequestSchema)],
        handler: AuthController.loginWithHash
    },
    {
        name: 'Me',
        method: 'get',
        path: '/api/me',
        middleware: [authorizeUser()],
        handler: AuthController.me
    },
    {
        name: 'Me',
        method: 'get',
        path: '/api/wallets',
        middleware: [authorizeUser()],
        handler: AuthController.getWallets
    },
    {
        name: 'Get temporary hash to redirect meta store',
        method: 'get',
        path: '/api/temp_hash',
        middleware: [authorizeUser()],
        handler: AuthController.getTempHash
    },
    {
        name: 'Buy Parcel',
        method: 'put',
        path: '/api/parcel/buy',
        middleware: [authorizeUser()],
        handler: ParcelController.buy
    }, {
        name: 'Parcel bought update',
        method: 'put',
        path: '/api/buy/parcels/:id',
        middleware: [authorizeUser(), validate(ParcelBuySchema)],
        handler: ParcelController.buy
    }, {
        name: 'Retrieve parcel By handle',
        method: 'get',
        path: '/api/parcel_by_handle/:id',
        middleware: [authorizeUser(), validate(ParcelRetrieveSchema)],
        handler: ParcelController.retrieveByHandle
    }, {
        name: 'Make on sale',
        method: 'put',
        path: '/api/parcel/:id/onsale',
        middleware: [authorizeUser(), validate(ParcelRetrieveSchema)],
        handler: ParcelController.makeOnSale
    }, {
        name: 'Cancel sale',
        method: 'put',
        path: '/api/parcel/:id/cancel-sale',
        middleware: [authorizeUser(), validate(ParcelRetrieveSchema)],
        handler: ParcelController.cancelOnSale
    }, {
        name: 'Tilia Auth Redirect Url',
        method: 'get',
        path: '/api/tilia/auth_url',
        middleware: [authorizeUser()],
        handler: PaymentController.getRedirectUrl
    }
]
export default routes;