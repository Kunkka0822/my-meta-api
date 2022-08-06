import { faker } from "@faker-js/faker";
import { PropertyStatus } from "@prisma/client";
import { Request } from "express";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { sanitizePager } from "../lib/helpers/utils";
import {
  ParcelOnSaleRequest,
  ParcelQuery,
  ParcelsByHandleQuery,
} from "../lib/types/parcel.types";
import { AuthRequest } from "../lib/types/user.types";
import { prisma } from "../models";
import { parcelResponse } from "../models/parcel";
import MapboxGeoService from "../services/mapbox.geo.service";
import { ParcelEntityService } from "../services/parcel.entity.service";
import { ParcelSaleService } from "../services/parcel.sale.service";
import { UserEntityService } from "../services/user.entity.service";

export const ParcelController = {
  retrieve: async (req: Request) => {
    const id = parseInt(req.params.id);
    const parcel = await prisma.parcel.findFirstOrThrow({
      where: { id },
      include: { owner: true },
    });
    if (!parcel.owner) {
      const admin = await UserEntityService.getAdmin();
      parcel.owner = admin;
    }
    return parcelResponse(parcel);
  },

  // used by unity
  retrieveByHandle: async (req: AuthRequest) => {
    const id = req.params.id;
    const user = req.user;

    let parcel = await prisma.parcel.findFirst({
      where: { handleId: id },
      include: { owner: true },
    });
    if (!parcel) {
      const data = req.query;
      if (
        !data ||
        !data.longlat ||
        data.longlat === "null" ||
        !data.square ||
        data.square === "null"
      ) {
        throw new ControllerError("Not found");
      }
      const { square, longlat } = data;
      const { regionCode, place, countryCode } =
        await MapboxGeoService.getAddress(longlat as string);
      const address = place + " " + faker.random.numeric(5);

      parcel = await prisma.parcel.create({
        data: {
          image: "https://mymeta.dev.playmymeta.app/images/parcel.png",
          address: address as string,
          square: parseInt(square as string),
          price: parseInt(square as string),
          contractAddress: "xxx",
          handleId: id,
          status: PropertyStatus.UNMINTED,
          createdBy: user.id,
          longlat: longlat as string,
          regionCode,
          countryCode,
        },
        include: {
          owner: true,
        },
      });
    }
    if (!parcel.owner) {
      const admin = await UserEntityService.getAdmin();
      parcel.owner = admin;
    }
    return parcelResponse(parcel);
  },
  makeOnSale: async (req: AuthRequest) => {
    const id = req.params.id;
    const user = req.user;
    let parcel = await prisma.parcel.findFirst({
      where: { id: parseInt(id), ownerId: user.id },
    });
    if (!parcel) throw new ControllerError("Not found");
    if (parcel.status === PropertyStatus.SECURING) {
      throw new ControllerError("Now securing ownership");
    }
    const data = req.body as ParcelOnSaleRequest;
    await ParcelEntityService.update(parcel, {
      status: PropertyStatus.ONSALE,
      price: data.price,
    });
    return parcelResponse(parcel);
  },
  cancelOnSale: async (req: AuthRequest) => {
    const id = req.params.id;
    const user = req.user;
    let parcel = await prisma.parcel.findFirst({
      where: { id: parseInt(id), ownerId: user.id },
    });
    if (!parcel) throw new ControllerError("Not found");
    if (parcel.status !== PropertyStatus.ONSALE) {
      throw new ControllerError("Is not on sale");
    }
    await ParcelEntityService.update(parcel, { status: PropertyStatus.OWNED });
    return parcelResponse(parcel);
  },
  getByHandle: async (req: AuthRequest) => {
    const queryData = req.query as unknown as ParcelsByHandleQuery;
    const { handleIds } = queryData;
    const parcels = await prisma.parcel.findMany({
      where: {
        handleId: { in: handleIds },
      },
      include: { owner: true },
    });
    return parcelResponse(parcels);
  },
  get: async (req: Request) => {
    const { page, size } = sanitizePager(req.query as ParcelQuery);
    const parcels = await prisma.parcel.findMany({
      take: size,
      skip: (page - 1) * size,
      include: { owner: true },
    });
    return parcelResponse(parcels);
  },
  buy: async (req: AuthRequest) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    let parcel = await prisma.parcel.findFirstOrThrow({
      where: { id },
      include: { owner: true },
    });
    // TODO check if it's real from subgraph
    if (
      parcel.status !== PropertyStatus.ONSALE &&
      parcel.status !== PropertyStatus.UNMINTED
    ) {
      throw new ControllerError("This property is not on sale");
    }

    if (parcel.status === PropertyStatus.UNMINTED) {
      await ParcelSaleService.mint(parcel, user);
    } else {
      await ParcelSaleService.buy(parcel, user);
    }
    return parcelResponse(parcel);
  },
  retrieveMyParcels: async (req: AuthRequest) => {
    const user = req.user;
    const parcels = await prisma.parcel.findMany({
      where: {
        ownerId: user.id,
      },
    });
    return parcelResponse(parcels);
  },
};
