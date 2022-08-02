import { PropertyStatus } from "@prisma/client";
import { prisma } from "../models";

const parcelSeeder = async () => {
    for (let i = 0; i < 50; i++) {
        const parcel = await prisma.parcel.create({
            data: {
                image: 'https://mymeta.dev.playmymeta.app/images/parcel.png',
                address: 'test address',
                square: 10,
                price: 10,
                contractAddress: 'xxx',
                handleId: i.toString(),
                status: PropertyStatus.UNMINTED
            },
            include: {
                owner: true
            }
        })
    }

}
parcelSeeder();