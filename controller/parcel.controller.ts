import { Request } from "express";
import { prisma } from "../models";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { sanitizePager } from "../lib/helpers/utils";
import { ParcelBoughtRequest, ParcelQuery, ParcelsByHandleQuery } from "../lib/types/parcel.types";
import { PropertyStatus } from "@prisma/client";

export class ParcelController {
    private static instance: ParcelController
    static getInstance(): ParcelController {
        if (this.instance) return this.instance;
        this.instance = new ParcelController
        return this.instance;
    }

    async retrieve(req: Request) {
        const id = parseInt(req.params.id);
        const parcel = await prisma.parcel.findFirstOrThrow({ where: { id } });
        if (parcel === null) 
            throw new ControllerError('Not Found', 404);
        return parcel;
    }
    async retrieveByHandle(req: Request) {
        const id = req.params.id;
        const parcel = await prisma.parcel.findFirstOrThrow({ where: { handleId: id } });
        if (parcel === null) 
            throw new ControllerError('Not Found', 404);
        return parcel;
    }
    async getByHandle(req: Request) {
        const queryData = req.query as unknown as ParcelsByHandleQuery;
        const { handleIds } = queryData;
        const parcels = await prisma.parcel.findMany({
            where: {
                handleId: { in: handleIds }
            },
            include: {
                owner: true
            }
        })
        return parcels;
    }
    async get(req: Request) {
        const { page, size } = sanitizePager(req.query as ParcelQuery);
        const parcels = await prisma.parcel.findMany({
            take: size,
            skip: (page - 1) * size
        })
        return parcels;
    }
    async buy(req: Request) {
        const id = parseInt(req.params.id);
        const data = req.body as ParcelBoughtRequest;
        let parcel = await prisma.parcel.findFirstOrThrow({ where: { id } });
        // TODO check if it's real from subgraph
        if (parcel.status !== PropertyStatus.ONSALE) {
            throw new ControllerError('This property is not on sale');
        }
        
        // const parcel = await prisma.parcel.update({
        //     where: { id },
        //     data: { ownerAddress: data.ownerAddress, status: PropertyStatus.SECURING }
        // })
        return parcel;
    }
}