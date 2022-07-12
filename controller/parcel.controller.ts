import { Request } from "express";
import { sanitizePager } from "../lib/helpers/utils";
import { ParcelQuery } from "../lib/types/parcel.types";
import Parcel from "../models/parcel";

export class ParcelController {

    async retrieve(req: Request) {
        // TODO
        const id = req.params.id;

    }
    async get(req: Request) {
        // TODO
        const { page, size } = sanitizePager(req.query as ParcelQuery);
        const parcels = await Parcel.findAll({
            limit: size,
            offset: (page - 1) * size
        })
        return parcels;
    }
    
}