import { Parcel, PropertyStatus, User } from "@prisma/client";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { ParcelData } from "../lib/types/parcel.types";
import { prisma } from "../models";
import { ParcelEntityService } from "../services/parcel.entity.service";
import { UserSaleService } from "../services/user.sale.service";

const buy = async (parcel: Parcel, user: User) => {
  if (parcel.price === null) throw new ControllerError("Price is null");
  if (parcel.ownerId === null) throw new ControllerError("Owner is null");
  if (user.MMC < parcel.price) {
    throw new ControllerError("Not Enough Balance");
  }
  const owner = await prisma.user.findFirstOrThrow({
    where: { id: parcel.ownerId },
  });
  if (!owner) {
    return mint(parcel, user);
  }

  if (parcel.status !== PropertyStatus.ONSALE) {
    throw new ControllerError("This parcel is not on sale");
  }
  await UserSaleService.burnMMC(user, parcel.price);
  await ParcelEntityService.update(parcel, { status: PropertyStatus.SECURING });

  /**
   * TODO transfer token to owner from user
   * if success
   * this.updateOwner(parcel, user)
   */

  // Temporary
  setTimeout(async () => {
    if (parcel.price === null) throw new ControllerError("Price is null");
    await UserSaleService.transferMMC(owner, parcel.price);
    await ParcelEntityService.update(parcel, {
      ownerAddress: user.chainAccount,
      ownerId: user.id,
      status: PropertyStatus.OWNED,
    });
  }, 10000);
};
const mint = async (parcel: Parcel, user: User) => {
  if (parcel.price === null) throw new ControllerError("Price is null");
  if (user.MMC < parcel.price) {
    throw new ControllerError("Not enough token");
  }
  if (parcel.status !== PropertyStatus.UNMINTED)
    throw new ControllerError("This is already minted");
  await ParcelEntityService.update(parcel, { status: PropertyStatus.SECURING });
  await UserSaleService.burnMMC(user, parcel.price);
  /**
   * TODO transfer token to owner from user
   * ...
   * if success
   * this.updateOwner(parcel, user);
   */
  setTimeout(async () => {
    await ParcelEntityService.update(parcel, {
      ownerAddress: user.chainAccount,
      ownerId: user.id,
      status: PropertyStatus.OWNED,
    });
  }, 10000);
};
const updateParcel = async (parcel: Parcel, data: ParcelData) => {
  const updated = await prisma.parcel.update({
    where: {
      id: parcel.id,
    },
    data,
  });
  Object.assign(parcel, updated);
};

export const ParcelSaleService = {
  buy,
  mint,
  updateParcel,
};
