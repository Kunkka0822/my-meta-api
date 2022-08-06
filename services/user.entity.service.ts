import { Role, User } from "@prisma/client";
import { UserData } from "../lib/types/user.types";
import { prisma } from "../models";

export const UserEntityService = {
  update: async (user: User, data: UserData) => {
    const updated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    Object.assign(user, { ...data, updated });
  },
  getAdmin: async () => {
    return await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });
  },
};
