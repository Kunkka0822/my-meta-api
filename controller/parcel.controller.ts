import { Request } from "express";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { sanitizePager } from "../lib/helpers/utils";
import { ParcelQuery } from "../lib/types/parcel.types";
import Parcel from "../models/parcel";

export class ParcelController {

    async retrieve(req: Request) {
        const id = req.params.id;
        const parcel = await Parcel.findOne({ where: { id } });
        if (parcel === null) 
            throw new ControllerError('Not Found', 404);
        return parcel;
    }
    async retrieveByHandle(req: Request) {
        const id = req.params.id;
        const parcel = await Parcel.findOne({ where: { handleId: id } });
        if (parcel === null) 
            throw new ControllerError('Not Found', 404);
        return parcel;
    }
    
    async get(req: Request) {
        const { page, size } = sanitizePager(req.query as ParcelQuery);
        const parcels = await Parcel.findAll({
            limit: size,
            offset: (page - 1) * size
        })
        return parcels;
    }
    
}