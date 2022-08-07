import { Route } from ".";
import { AuthController } from "../controller/auth.controller";
import { ParcelController } from "../controller/parcel.controller";
import { PaymentController } from "../controller/payment.controller";
import { authorizeUser } from "../middleware/authorizeUser";
import validate from "../middleware/validate";
import {
  ParcelBuySchema,
  ParcelRetrieveSchema,
  ParcelsMakeSaleSchema,
} from "./validation/parcel";
import {
  TokenPurchaseStep1Schema,
  TokenPurchaseStep2Schema,
} from "./validation/tokenPurchase";
import {
  LoginHashRequestSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
} from "./validation/user";

const routes: Route[] = [
  {
    name: "Register",
    method: "post",
    path: "/api/register",
    middleware: [validate(RegisterRequestSchema)],
    handler: AuthController.register,
  },
  {
    name: "Login",
    method: "post",
    path: "/api/login",
    middleware: [validate(LoginRequestSchema)],
    handler: AuthController.login,
  },
  {
    name: "Login with hash",
    method: "post",
    path: "/api/signin-hash",
    middleware: [validate(LoginHashRequestSchema)],
    handler: AuthController.loginWithHash,
  },
  {
    name: "Login on web",
    method: "post",
    path: "/api/signin",
    middleware: [validate(LoginRequestSchema)],
    handler: AuthController.loginWithWeb,
  },
  {
    name: "Me",
    method: "get",
    path: "/api/me",
    middleware: [authorizeUser()],
    handler: AuthController.me,
  },
  {
    name: "Me(Web)",
    method: "get",
    path: "/api/metastore-session",
    middleware: [authorizeUser()],
    handler: AuthController.meWeb,
  },
  {
    name: "Me",
    method: "get",
    path: "/api/wallets",
    middleware: [authorizeUser()],
    handler: AuthController.getWallets,
  },
  {
    name: "Me",
    method: "get",
    path: "/api/balances",
    middleware: [authorizeUser()],
    handler: AuthController.getBalances,
  },
  {
    name: "Get temporary hash to redirect meta store",
    method: "get",
    path: "/api/temp_hash",
    middleware: [authorizeUser()],
    handler: AuthController.getTempHash,
  },
  {
    name: "Buy Parcel",
    method: "put",
    path: "/api/parcel/buy",
    middleware: [authorizeUser()],
    handler: ParcelController.buy,
  },
  {
    name: "Parcel bought update",
    method: "put",
    path: "/api/buy/parcels/:id",
    middleware: [authorizeUser(), validate(ParcelBuySchema)],
    handler: ParcelController.buy,
  },
  {
    name: "Retrieve parcel By handle",
    method: "get",
    path: "/api/parcel_by_handle/:id",
    middleware: [authorizeUser(), validate(ParcelRetrieveSchema)],
    handler: ParcelController.retrieveByHandle,
  },
  {
    name: "Make on sale",
    method: "put",
    path: "/api/parcel/:id/onsale",
    middleware: [authorizeUser(), validate(ParcelsMakeSaleSchema)],
    handler: ParcelController.makeOnSale,
  },
  {
    name: "Cancel sale",
    method: "put",
    path: "/api/parcel/:id/cancel-sale",
    middleware: [authorizeUser(), validate(ParcelRetrieveSchema)],
    handler: ParcelController.cancelOnSale,
  },
  {
    name: "Purchase Token Step 1",
    method: "post",
    path: "/api/purchase_token/step1",
    middleware: [authorizeUser(), validate(TokenPurchaseStep1Schema)],
    handler: PaymentController.tokenPurchaseStep1,
  },
  {
    name: "Purchase Token Step 2",
    method: "post",
    path: "/api/purchase_token/step2",
    middleware: [authorizeUser(), validate(TokenPurchaseStep2Schema)],
    handler: PaymentController.tokenPurchaseStep2,
  },
];
export default routes;
