import { Route } from ".";
import { authorize } from "../middleware/authorize";


const routes: Route[] = [
]
export default routes.map(route => {
    if (route.middleware) {
        route.middleware.push(authorize());
    }
    return route;
})