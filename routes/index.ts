import { NextFunction, Request, Response } from "express"
import userRoutes from './public';
import adminRoutes from './admin';

export type Route = {
    name: string,
    method: 'post' | 'get' | 'delete' | 'put',
    path: string,
    middleware?: ((req: Request, res: Response, next: NextFunction) => Promise<any>)[],
    handler: (data: any) => Promise<any>
}

export default [...userRoutes, ...adminRoutes];