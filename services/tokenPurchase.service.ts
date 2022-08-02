import { TokenPurchase } from "@prisma/client";
import { prisma } from "../models";
import { TokenPurchaseData } from "../lib/types/tokenPurchase.type";

export const TokenPurchaseService = {
    update: async (tokenPurchase: TokenPurchase, data: TokenPurchaseData) => {
        const updated = await prisma.tokenPurchase.update({
            where: {
                id: tokenPurchase.id
            },
            data,
            include: { buyer: true }
        });
        Object.assign(tokenPurchase, updated);
    }
}