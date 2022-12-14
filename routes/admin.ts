import { Route } from ".";
import { ParcelController } from "../controller/admin/parcel.controller";
import { authorizeUser } from "../middleware/authorizeUser";
import validate from "../middleware/validate";
import { ParcelCreateSchema } from "./validation/parcel";

const routes: Route[] = [
    {
        name: 'Parcel create',
        method: 'post',
        path: '/api/admin/parcels',
        middleware: [validate(ParcelCreateSchema)],
        handler: ParcelController.create
    }
]
export default routes.map(route => {
    if (route.middleware) {
        // TODO change into authorizeAdmin
        route.middleware.push(authorizeUser());
    }
    return route;
})