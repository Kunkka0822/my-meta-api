import { Request } from "express";
import { ParcelRequest } from "../../lib/types/parcel.types";
import Parcel from "../../models/parcel";

export class ParcelController {
    constructor() {}

    async create(req: Request) {
        // TODO save parcel to mysql
        const data = req.body as ParcelRequest;
        const parcel = await Parcel.create({...data});
        return parcel;
    }
}