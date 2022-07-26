import { Parcel, PropertyStatus, User } from "@prisma/client";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { prisma } from "../models";

export class ParcelContract {
    async buy(parcel: Parcel, user: User) {
        const owner = await prisma.user.findFirstOrThrow({ where: {id: parcel.ownerId } });
        if (!owner) {
            return this.mint(parcel.handleId, user);
        }
        
        if (parcel.status !== PropertyStatus.ONSALE) {
            throw new ControllerError('This parcel is not on sale');
        }
        /**
         * TODO transfer token to owner from user
         * if success
         * this.updateOwner(parcel, user)
         */

        // Temporary
        setTimeout(() => {
            this.updateOwner(parcel, user);
        }, 60000)
    }

    async mint(handleId: string, user: User) {
        let parcel = await prisma.parcel.findFirst({ where: { handleId } });
        if (!parcel) {
            // TODO request mapbox to get information from building id and save it to database
            // now throw exception
            throw new ControllerError('Not yet prepared')
        }
        if (parcel.status !== PropertyStatus.UNMINTED) throw new ControllerError('This is already minted');
        /**
         * TODO transfer token to owner from user
         * ...
         * if success
         * this.updateOwner(parcel, user);
         */
        setTimeout(() => {
            this.updateOwner(parcel, user);
        }, 60000)
    }
    private async updateOwner(parcel: Parcel, user: User) {
        return await prisma.parcel.update({
            where: {
                id: parcel.id
            },
            data: {
                ownerAddress: user.wallet,
                ownerId: user.id
            }
        });
    }
}