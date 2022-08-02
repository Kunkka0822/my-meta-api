import { Request } from "express";
import { convertUnserializable, prisma } from "../models";

export const TokenProductController = {
    get: async () => {
        const tokenProducts = await prisma.tokenProduct.findMany();
        return convertUnserializable(tokenProducts);
    }
}