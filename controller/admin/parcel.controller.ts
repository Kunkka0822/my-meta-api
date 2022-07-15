import { Request } from "express";
import { ControllerError } from "../../lib/exceptions/controller_exception";
import { ParcelRequest } from "../../lib/types/parcel.types";
import Parcel from "../../models/parcel";

export class ParcelController {
    constructor() {}

    async create(req: Request) {
        // TODO save parcel to mysql
        const data = req.body as ParcelRequest;
        const existing = await Parcel.findOne({ where: { handleId: data.handleId }})
        if (existing) {
            throw new ControllerError('Already existing');
        }
        const parcel = await Parcel.create({...data});
        return parcel;
    }
}