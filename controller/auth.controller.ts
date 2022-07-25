import { Request } from "express";
import { LoginRequest, RegisterRequest } from "../lib/types/user.types";
import { ethers } from "ethers";
import { convertUnserializable, prisma } from "../models";
import { sign } from 'jsonwebtoken';
import { compareSync, hashSync } from "bcrypt";
import { env } from "../lib/helpers/env";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { userResponse } from "../models/user";

export class AuthController {
    async register(req: Request) {
        const data = req.body as RegisterRequest;
        let existing = await prisma.user.findFirst({ where: { email: data.email } })
        if (existing) throw new ControllerError('Email is already taken');
        existing = await prisma.user.findFirst({ where: { username: data.username }});
        if (existing) throw new ControllerError('Username is already taken');

        const wallet = ethers.Wallet.createRandom();
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashSync(data.password, 10),
                wallet: wallet.address
            }
        })

        // private key save on db(in the future save on aws ssm or )
        await prisma.key.create({
            data: {
                pkey: wallet.privateKey,
                userId: user.id
            }
        })
        return userResponse(user);
    }
    async login(req: Request) {
        const data = req.body as LoginRequest;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: data.email
            }
        });
        if (!compareSync(data.password, user.password)) throw new ControllerError('Incorrect password', 404);
        const token = sign({ id: Number(user.id) }, env('JWT_SECRET'), { expiresIn: '1000h'})
        return convertUnserializable({ user: userResponse(user), token });
    }
}