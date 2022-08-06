import { NextFunction, Request, Response } from "express";
import adminRoutes from "./admin";
import publicRoutes from "./public";
import userRoutes from "./user";

export type Route = {
  name: string;
  method: "post" | "get" | "delete" | "put";
  path: string;
  middleware?: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>)[];
  handler: (data: any) => Promise<any>;
};

export default [...publicRoutes, ...adminRoutes, ...userRoutes];
