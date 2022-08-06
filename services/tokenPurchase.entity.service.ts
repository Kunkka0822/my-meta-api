import { TokenPurchase } from "@prisma/client";
import { TokenPurchaseData } from "../lib/types/tokenPurchase.type";
import { prisma } from "../models";

export const TokenPurchaseEntityService = {
  update: async (tokenPurchase: TokenPurchase, data: TokenPurchaseData) => {
    const updated = await prisma.tokenPurchase.update({
      where: {
        id: tokenPurchase.id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: { buyer: true },
    });
    Object.assign(tokenPurchase, updated);
  },
};
