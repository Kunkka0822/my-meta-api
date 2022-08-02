import { prisma } from './models';
import fetch from 'node-fetch';
import { hashSync } from "bcrypt";
import { ethers } from "ethers";

fetch('https://mymeta-78aa8-default-rtdb.firebaseio.com/engagement_wall.json')
.then(response => response.json())
.then(response => {
    Promise.all(response.applications.players.filter((item: any) => !!item && !!item.main).map((player: any, index: number) => {
        const wallet = ethers.Wallet.createRandom();
        return prisma.user.create({
            data: {
                password: hashSync('123123123', 10),
                email: player.main.email,
                chainAccount: wallet.address,
                coupon: player.main.coupon,
                isReferral: player.main.is_referral,
                lineNumber: player?.main?.line_number || 0,
                miles: player.main.miles,
                milesMax: player.main.miles_max,
                online: player.main.online,
                rank: player.main.rank,
                speed: player.main.speed,
                name: player.main.name,
                MMC: player.main.MMC,

                userOnline: {
                    create: {
                        loc0: player.online.loc0 || 0,
                        loc1: player.online.loc1 || 0,
                        state: player.online.state
                    }
                },
                userSkin: {
                    create: {
                        color: player?.skin?.color || 0,
                        hat: player?.skin?.hat || 0,
                        shoes: player?.skin?.shoes || 0,
                        torso: player?.skin?.torso || 0,
                    }
                },
                userTravel: {
                    create: {
                        loc0: player?.travel?.loc0 || "0",
                        loc1: player?.travel?.loc1 || "0",
                        speed: player?.travel?.speed ? player?.travel?.speed : 0.1550000011920929,
                        isTravel: player?.travel?.isTravel || 0
                    }
                },
                key: {
                    create: {
                        pkey: wallet.privateKey
                    }
                }
            }
        })
    })).then(() => {
        console.log('completed')
    })
})