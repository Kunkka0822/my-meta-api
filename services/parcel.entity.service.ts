import { Parcel } from "@prisma/client";
import { ParcelData } from "../lib/types/parcel.types";
import { prisma } from "../models";

export const ParcelEntityService = {
  update: async (parcel: Parcel, data: ParcelData) => {
    const updated = await prisma.parcel.update({
      where: {
        id: parcel.id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: { owner: true },
    });
    Object.assign(parcel, updated);
  },
};
