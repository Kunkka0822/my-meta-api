import { ParcelPurchase } from "@prisma/client";
import { prisma } from "../models";

export const ParclePurchaseEntityService = {
  update: async (entity: ParcelPurchase, data: Partial<ParcelPurchase>) => {
    const updated = await prisma.parcelPurchase.update({
      where: {
        id: entity.id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    Object.assign(entity, updated);
  },
};
