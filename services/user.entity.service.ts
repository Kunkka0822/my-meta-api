import { User } from "@prisma/client";
import { UserData } from "../lib/types/user.types";
import { prisma } from "../models";

export const UserEntityService = {
    update: async (user: User, data: UserData) => {
        const updated = await prisma.user.update({
            where: {
                id: user.id
            },
            data
        })
        Object.assign(user, {...data, updated});
    }
}