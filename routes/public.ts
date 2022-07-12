import { Route } from ".";
import { ParcelController } from "../controller/parcel.controller";
import validate from "../middleware/validate"
import { ParcelQuerySchema } from "./validation/parcel";

const parcelController = new ParcelController;
const routes: Route[] = [
    {
        name: 'Parcel list',
        method: 'get',
        path: '/api/parcels',
        middleware: [validate(ParcelQuerySchema)],
        handler: parcelController.get
    }
]
export default routes;