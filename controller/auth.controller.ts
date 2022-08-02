import { Request } from "express";
import { AuthRequest, LoginRequest, RegisterRequest } from "../lib/types/user.types";
import { ethers } from "ethers";
import { convertUnserializable, prisma } from "../models";
import { sign } from 'jsonwebtoken';
import { compareSync, hashSync } from "bcrypt";
import { env } from "../lib/helpers/env";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { sessionResponse, userResponse, webSessionResponse } from "../models/user";
import { generateToken } from "../lib/helpers/utils";
import { addHoursToDate } from "../lib/helpers/date";
import { TiliaService } from "../services/tilia.service";
import { UserEntityService } from "../services/user.entity.service";

export const AuthController = {
    register: async (req: Request) => {
        const data = req.body as RegisterRequest;
        let existing = await prisma.user.findFirst({ where: { email: data.email } })
        if (existing) throw new ControllerError('Email is already taken');
        existing = await prisma.user.findFirst({ where: { name: data.name }});
        if (existing) throw new ControllerError('Username is already taken');

        const wallet = ethers.Wallet.createRandom();

        const tiliaId = await TiliaService.registerUser(data);
        
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashSync(data.password, 10),
                chainAccount: wallet.address,
                coupon: 'TEST_COUPON',
                isReferral: false,
                lineNumber: 0,
                miles: 0,
                milesMax: 500,
                online: true,
                rank: 0,
                speed: 0.1550000011920929,
                tiliaId,
                MMC: 1000,

                userOnline: {
                    create: {
                        loc0: 0,
                        loc1: 0,
                        state: 'static'
                    }
                },
                userSkin: {
                    create: {
                        color: 0,
                        hat: 0,
                        shoes: 0,
                        torso: 0
                    }
                },
                userTravel: {
                    create: {
                        dateEnd: 0,
                        dateStart: 0,
                        gasStart: 0,
                        isTravel: 0,
                        loc0: "",
                        loc1: "",
                        speed: 0
                    }
                },
                key: {
                    create: {
                        pkey: wallet.privateKey
                    }
                }
            },
            include: {
                userOnline: true,
                userSkin: true,
                userTravel: true
            }
        })
        return sessionResponse(user);
    },
    getWallets: async (req: AuthRequest) => {
        const user = req.user;
        const wallets = TiliaService.getUserWallets(user);
        return wallets;
    },
    login: async (req: Request) => {
        const data = req.body as LoginRequest;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: data.email
            },
            include: {
                userOnline: true,
                userSkin: true,
                userTravel: true,
            }
        });
        if (!compareSync(data.password, user.password)) throw new ControllerError('Incorrect password', 404);
        const token = sign({ id: Number(user.id) }, env('JWT_SECRET'), { expiresIn: '100 days'})

        if (!user.tiliaId) {
            const tiliaId = await TiliaService.registerUser(user);
            await UserEntityService.update(user, { tiliaId });
        }
        return convertUnserializable({ ...sessionResponse(user), token });
    },
    loginWithWeb: async (req: Request) => {
        const data = req.body as LoginRequest;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: data.email
            },
            include: {
                userOnline: true,
                userSkin: true,
                userTravel: true,
            }
        });
        if (!compareSync(data.password, user.password)) throw new ControllerError('Incorrect password', 404);
        const token = sign({ id: Number(user.id) }, env('JWT_SECRET'), { expiresIn: '100 days'})

        if (!user.tiliaId) {
            const tiliaId = await TiliaService.registerUser(user);
            await UserEntityService.update(user, { tiliaId });
        }
        return {
            session: webSessionResponse(user),
            token,
        };
    },
    loginWithHash: async (req: Request) => {
        const now = new Date;
        const hash = req.body.hash;
        const tempHash = await prisma.tempHash.findFirst({ where: { hash, expiredAt: { gt: now } }, include: { user: true}});
        if (!tempHash || tempHash.expiredAt < now) {
            throw new ControllerError('Token is expired or invalid', 401);
        }
        await prisma.tempHash.update({
            where: { id: tempHash.id },
            data: { expiredAt: new Date }
        })
        const user = tempHash.user;

        const token = sign({ id: Number(user.id) }, env('JWT_SECRET'), { expiresIn: '100 days'})
        if (!user.tiliaId) {
            const tiliaId = await TiliaService.registerUser(user);
            await UserEntityService.update(user, { tiliaId });
        }
        return {
            session: webSessionResponse(user),
            token,
        };
    },
    me: async (req: AuthRequest) => {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: req.user.id
            },
            include: {
                userOnline: true,
                userSkin: true,
                userTravel: true,
            }
        })
        return sessionResponse(user);
    },
    meWeb: async (req: AuthRequest) => {
        const user = req.user;
        return webSessionResponse(user);
    },
    getTempHash: async (req: AuthRequest) => {
        const user = req.user;
        const tempHash = await prisma.tempHash.create({
            data: {
                userId: user.id,
                hash: generateToken(),
                createdAt: new Date,
                expiredAt: addHoursToDate(new Date, 1)
            }
        })
        return { hash: tempHash.hash }
    }
}