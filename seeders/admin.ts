import { Role } from "@prisma/client";
import { hashSync } from "bcrypt";
import { ethers } from "ethers";
import { prisma } from "../models";
import { TiliaService } from "../services/tilia.service";

const adminSeeder = async () => {
  const admin = {
    email: "admin@playmymeta.com",
    password: "abc",
    name: "MyMeta",
  };

  const wallet = ethers.Wallet.createRandom();
  const tiliaId = await TiliaService.registerUser(admin);

  await prisma.user.create({
    data: {
      ...admin,
      password: hashSync(admin.password, 10),
      chainAccount: wallet.address,
      coupon: "ADMIN_COUPON",
      isReferral: false,
      lineNumber: 0,
      miles: 0,
      milesMax: 500,
      online: true,
      rank: 0,
      speed: 0.1550000011920929,
      tiliaId,
      MMC: 0,
      role: Role.ADMIN,
      userOnline: {
        create: {
          loc0: 0,
          loc1: 0,
          state: "static",
        },
      },
      userSkin: {
        create: {
          color: 0,
          hat: 0,
          shoes: 0,
          torso: 0,
        },
      },
      userTravel: {
        create: {
          dateEnd: 0,
          dateStart: 0,
          gasStart: 0,
          isTravel: 0,
          loc0: "",
          loc1: "",
          speed: 0,
        },
      },
      key: {
        create: {
          pkey: wallet.privateKey,
        },
      },
    },
    include: {
      userOnline: true,
      userSkin: true,
      userTravel: true,
    },
  });
};

adminSeeder();
