import { Request } from "express";
import { prisma } from "../../models";
import { ControllerError } from "../../lib/exceptions/controller_exception";
import { ParcelRequest } from "../../lib/types/parcel.types";

export const ParcelController = {
    create: async (req: Request) => {
        // TODO save parcel to mysql
        const data = req.body as ParcelRequest;
        const existing = await prisma.parcel.findFirst({ where: { handleId: data.handleId }})
        if (existing) {
            throw new ControllerError('Already existing');
        }
        const parcel = await prisma.parcel.create({ data });
        return parcel;
    }
}