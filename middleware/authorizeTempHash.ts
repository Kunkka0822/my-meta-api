import { NextFunction, Response } from "express";
import { prisma } from "../models";
import { AuthRequest } from "../lib/types/user.types";

export const authorizeTempHash = () => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const hash = req.body.hash || req.query.hash
        if (!hash) return res.status(401).json({ message: 'Please login' });

        const now = new Date;

        const tempHash = await prisma.tempHash.findFirst({ where: { hash, expiredAt: { gt: now } }, include: { user: true}});
        if (!tempHash || tempHash.expiredAt < now) {
            return res.status(401).json({ message: 'Token is expired or invalid' });
        }
        // await prisma.tempHash.update({
        //     where: {
        //         id: tempHash.id
        //     },
        //     data: {
        //         expiredAt: now
        //     }
        // })
        req.user = tempHash.user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate user' });
    }
}