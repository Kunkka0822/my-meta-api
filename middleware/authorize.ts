import { Request, NextFunction, Response } from "express";

export const authorize = () => async (req: Request, res: Response, next: NextFunction) => {
    // TODO authorize
    next();
}