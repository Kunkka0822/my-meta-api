import {
  AuthRequest,
  UserOnlineRequest,
  UserSkinRequest,
  UserTravelRequest,
} from "../lib/types/user.types";
import { prisma } from "../models";
import { sessionResponse } from "../models/user";
import { TiliaService } from "../services/tilia.service";

export const UserController = {
  updateOnlineStatus: async (req: AuthRequest) => {
    const user = req.user;
    const data = req.body as UserOnlineRequest;

    await prisma.userOnline.update({
      where: {
        userId: user.id,
      },
      data,
    });
    const updatedUser = await prisma.user.findFirst({
      where: { id: user.id },
      include: {
        userOnline: true,
        userSkin: true,
        userTravel: true,
      },
    });
    const balances = await TiliaService.getUserBalances(user);
    return sessionResponse(updatedUser, balances);
  },
  updateSkin: async (req: AuthRequest) => {
    const user = req.user;
    const data = req.body as UserSkinRequest;

    await prisma.userSkin.update({
      where: {
        userId: user.id,
      },
      data,
    });
    const updatedUser = await prisma.user.findFirst({
      where: { id: user.id },
      include: {
        userOnline: true,
        userSkin: true,
        userTravel: true,
      },
    });
    const balances = await TiliaService.getUserBalances(user);
    return sessionResponse(updatedUser, balances);
  },
  updateTravel: async (req: AuthRequest) => {
    const user = req.user;
    const data = req.body as UserTravelRequest;
    await prisma.userTravel.update({
      where: {
        userId: user.id,
      },
      data,
    });
    const updatedUser = await prisma.user.findFirst({
      where: { id: user.id },
      include: {
        userOnline: true,
        userSkin: true,
        userTravel: true,
      },
    });
    const balances = await TiliaService.getUserBalances(user);
    return sessionResponse(updatedUser, balances);
  },
};
