import { User } from "@prisma/client";
import { Request, NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../models";
import { env } from "../lib/helpers/env";
import { AuthRequest } from "../lib/types/user.types";

export const authorizeTempHash = () => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const hash = req.body.hash || req.query.hash
        if (!hash) return res.status(401).json({ message: 'Please login' });

        const tempHash = await prisma.tempHash.findFirst({ where: { hash, expiredAt: { gt: new Date } }, include: { user: true}});
        if (!tempHash || tempHash.expiredAt < (new Date)) {
            return res.status(401).json({ message: 'Token is expired or invalid' });
        }
        req.user = tempHash.user;

    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate user' });        
    }
}