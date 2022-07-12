import { Route } from ".";
import { ParcelController } from "../controller/admin/parcel.controller";
import { authorize } from "../middleware/authorize";
import validate from "../middleware/validate";
import { ParcelCreateSchema } from "./validation/parcel";

const parcelController = new ParcelController;
const routes: Route[] = [
    {
        name: 'Parcel create',
        method: 'post',
        path: '/api/admin/parcels',
        middleware: [validate(ParcelCreateSchema)],
        handler: parcelController.create
    }
]


export default routes.map(route => {
    if (route.middleware) {
        route.middleware.push(authorize());
    }
    return route;
})