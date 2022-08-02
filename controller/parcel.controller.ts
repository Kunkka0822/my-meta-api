import { Request } from "express";
import { prisma } from "../models";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { sanitizePager } from "../lib/helpers/utils";
import { ParcelBoughtRequest, ParcelQuery, ParcelsByHandleQuery } from "../lib/types/parcel.types";
import { PropertyStatus } from "@prisma/client";
import { parcelResponse } from "../models/parcel";
import { ParcelSaleService } from "../services/parcel.sale.service";
import { AuthRequest } from "../lib/types/user.types";
import { ParcelEntityService } from "../services/parcel.entity.service";

export const ParcelController = {
    retrieve: async (req: Request) => {
        const id = parseInt(req.params.id);
        const parcel = await prisma.parcel.findFirstOrThrow({ where: { id }, include: { owner: true } });
        if (parcel === null) 
            throw new ControllerError('Not Found', 404);
        return parcelResponse(parcel);
    },

    // used by unity
    retrieveByHandle: async (req: AuthRequest) => {
        const id = req.params.id;
        const user = req.user;
        
        let parcel = await prisma.parcel.findFirst({ where: { handleId: id }, include: { owner: true } });
        if (!parcel) {
            const data = req.query;
            if (!data 
                || !data.address 
                || data.address === 'null' 
                || !data.square 
                || data.square === 'null' 
                || !data.latlng 
                || data.latlng === 'null') {
                throw new ControllerError('Not found');
            }
            const { address, square, latlng } = data;
            
            parcel = await prisma.parcel.create({
                data: {
                    image: 'https://mymeta.dev.playmymeta.app/images/parcel.png',
                    address: address as string,
                    square: parseInt(square as string),
                    price: parseInt(square as string),
                    contractAddress: 'xxx',
                    handleId: id,
                    status: PropertyStatus.UNMINTED,
                    createdBy: user.id,
                    latlng: latlng as string
                },
                include: {
                    owner: true
                }
            })
        }
        return parcelResponse(parcel);
    },
    makeOnSale: async (req: AuthRequest) => {
        const id = req.params.id;
        const user = req.user;
        let parcel = await prisma.parcel.findFirst({ where: { id: parseInt(id), ownerId: user.id}});
        if (!parcel) throw new ControllerError('Not found');
        if (parcel.status === PropertyStatus.SECURING) {
            throw new ControllerError('Now securing ownership');
        }
        await ParcelEntityService.update(parcel, { status: PropertyStatus.ONSALE });
        return parcelResponse(parcel);
    },
    cancelOnSale: async (req: AuthRequest) => {
        const id = req.params.id;
        const user = req.user;
        let parcel = await prisma.parcel.findFirst({ where: { id: parseInt(id), ownerId: user.id}});
        if (!parcel) throw new ControllerError('Not found');
        if (parcel.status !== PropertyStatus.ONSALE) {
            throw new ControllerError('Is not on sale');
        }
        await ParcelEntityService.update(parcel, { status: PropertyStatus.OWNED });
        return parcelResponse(parcel);
    },
    getByHandle: async (req: AuthRequest) => {
        const queryData = req.query as unknown as ParcelsByHandleQuery;
        const { handleIds } = queryData;
        const parcels = await prisma.parcel.findMany({
            where: {
                handleId: { in: handleIds }
            },
            include: { owner: true }
        })
        return parcels.map(parcel => parcelResponse(parcel));
    },
    get: async (req: Request) => {
        const { page, size } = sanitizePager(req.query as ParcelQuery);
        const parcels = await prisma.parcel.findMany({
            take: size,
            skip: (page - 1) * size,
            include: { owner: true }
        })
        return parcels.map(parcel => parcelResponse(parcel));
    },
    buy: async (req: AuthRequest) => {
        const id = parseInt(req.params.id);
        const user = req.user;
        const data = req.body as ParcelBoughtRequest;
        let parcel = await prisma.parcel.findFirstOrThrow({ where: { id },  include: { owner: true } });
        // TODO check if it's real from subgraph
        if (parcel.status !== PropertyStatus.ONSALE && parcel.status !== PropertyStatus.UNMINTED) {
            throw new ControllerError('This property is not on sale');
        }
        
        if (parcel.status === PropertyStatus.UNMINTED) {
            await ParcelSaleService.mint(parcel, user)
        } else {
            await ParcelSaleService.buy(parcel, user);
        }
        return parcelResponse(parcel);
    }
}