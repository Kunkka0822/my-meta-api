import { Route } from ".";
import { ParcelController } from "../controller/parcel.controller";
import validate from "../middleware/validate"
import { ParcelQuerySchema, ParcelRetrieveSchema } from "./validation/parcel";

const parcelController = new ParcelController;
const routes: Route[] = [
    {
        name: 'Parcel list',
        method: 'get',
        path: '/api/parcels',
        middleware: [validate(ParcelQuerySchema)],
        handler: parcelController.get
    }, {
        name: 'Retrieve parcel',
        method: 'get',
        path: '/api/parcels/:id',
        middleware: [validate(ParcelRetrieveSchema)],
        handler: parcelController.retrieve
    }
]
export default routes;