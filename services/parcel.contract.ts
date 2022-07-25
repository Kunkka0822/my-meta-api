import { Parcel, User } from "@prisma/client";
import { prisma } from "../models";

export class ParcelContract {
    async buy(parcel: Parcel, user: User) {
        const owner = await prisma.user.findFirstOrThrow({ where: {id: parcel.id} });
        // TODO transfer token to owner from user
        

        // if success
        
    }
}