import { Schema } from "express-validator";
import { PageQuerySchema, RetrieveQuerySchema } from "./common";

export const ParcelQuerySchema: Schema = {
    ...PageQuerySchema,
    // we may add search keyword query for the future
    // search: {
    //     in: ['query'],
    //     optional: { options: { nullable: true}}
    // }
}

export const ParcelRetrieveSchema: Schema = {
    ...RetrieveQuerySchema
}