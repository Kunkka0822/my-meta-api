import { prisma } from "../models";

const tokenProductSeeder = async () => {
    const tokenProducts = [
        {
            amount: 100,
            currency: 'MMC',
            price: 100
        }, 
        {
            amount: 1000,
            currency: 'MMC',
            price: 1000
        }, 
        {
            amount: 5000,
            currency: 'MMC',
            price: 5000
        }, 
        {
            amount: 10000,
            currency: 'MMC',
            price: 10000
        }, 
        {
            amount: 50000,
            currency: 'MMC',
            price: 50000
        }
    ];

    await prisma.tokenProduct.createMany({
        data: tokenProducts
    })
}
tokenProductSeeder();