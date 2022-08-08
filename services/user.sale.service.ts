import { User } from "@prisma/client";
import { prisma } from "../models";

export const UserSaleService = {
  transferMMC: async (toUser: User, amount: number) => {
    const toUpdated = await prisma.user.update({
      where: {
        id: toUser.id,
      },
      data: {
        MMC: Math.max(toUser.MMC + amount, 0),
      },
    });
    toUser.MMC = toUpdated.MMC;
  },
  burnMMC: async (user: User, amount: number) => {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        MMC: Math.max(user.MMC - amount, 0),
      },
    });
  },
};
