import { Route } from ".";
import { ParcelController } from "../controller/parcel.controller";
import validate from "../middleware/validate"
import { ParcelQuerySchema, ParcelRetrieveSchema, ParcelsByHandleSchema } from "./validation/parcel";

const routes: Route[] = [
    {
        name: 'Parcel list',
        method: 'get',
        path: '/api/parcels',
        middleware: [validate(ParcelQuerySchema)],
        handler: ParcelController.get
    }, {
        name: 'Retrieve parcel',
        method: 'get',
        path: '/api/parcels/:id',
        middleware: [validate(ParcelRetrieveSchema)],
        handler: ParcelController.retrieve
    }, {
        name: 'List parcels By handle',
        method: 'get',
        path: '/api/parcel_by_handle',
        middleware: [validate(ParcelsByHandleSchema)],
        handler: ParcelController.getByHandle
    }
]
export default routes;