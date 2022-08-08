import { Parcel, PropertyStatus, PurchaseStatus, User } from "@prisma/client";
import { ControllerError } from "../lib/exceptions/controller_exception";
import { env } from "../lib/helpers/env";
import { prisma } from "../models";
import { ParcelEntityService } from "../services/parcel.entity.service";
import { ParclePurchaseEntityService } from "./parcelPurchase.entity.service";
import { MMC_CURRENCY, TiliaService } from "./tilia.service";
import { UserSaleService } from "./user.sale.service";

const buy = async (parcel: Parcel, user: User) => {
  if (parcel.price === null) throw new ControllerError("Price is null");
  if (parcel.ownerId === null) throw new ControllerError("Owner is null");
  if (parcel.status !== PropertyStatus.ONSALE) {
    throw new ControllerError("This parcel is not on sale");
  }
  const oldStatus = parcel.status;

  try {
    await ParcelEntityService.update(parcel, {
      status: PropertyStatus.SECURING,
    });
    const owner = await prisma.user.findFirst({
      where: { id: parcel.ownerId },
    });

    if (!owner) {
      throw new ControllerError("There's no owner");
    }

    // Check balance
    const { mmcSpendable } = await TiliaService.getUserBalances(user);
    if (mmcSpendable < parcel.price) {
      throw new ControllerError("Not Enough Balance");
    }

    // calculate fee
    const feeRate = env("TRANSACTION_FEE_RATE");
    const fee = Math.round(parcel.price * parseFloat(feeRate));

    const parcelPurchase = await prisma.parcelPurchase.create({
      data: {
        amount: parcel.price,
        fee,
        currency: MMC_CURRENCY,
        buyerId: user.id,
        sellerId: owner.id,
        parcelId: parcel.id,
      },
    });

    // transfer token
    await Promise.all([
      UserSaleService.burnMMC(user, parcelPurchase.amount),
      UserSaleService.transferMMC(owner, parcelPurchase.amount - fee),
    ]);

    // transfer token to seller from buyer
    // const invoiceData = {
    //   account_id: user.tiliaId,
    //   invoice_type: "user_purchase_virtual",
    //   reference_type: "parcel_purchase_id",
    //   reference_id: parcelPurchase.id.toString(),
    //   description: `${user.name} bought parcel from ${owner.name}`,
    //   line_items: [
    //     {
    //       amount: parcel.price,
    //       currency: MMC_CURRENCY,
    //       description: `Parcel Address: ${parcel.address}`,
    //       transaction_type: "user_to_user",
    //       recipients: [
    //         {
    //           amount: parcel.price - fee,
    //           currency: MMC_CURRENCY,
    //           description: `${owner.name} got by selling parcel: ${parcel.address}`,
    //           destination_account_id: owner.tiliaId,
    //         },
    //         {
    //           amount: fee,
    //           currency: MMC_CURRENCY,
    //           description: `Admin collect fee from the transaction of parcel: ${parcel.address}`,
    //           destination_account_id: owner.tiliaId,
    //         },
    //       ],
    //     },
    //   ],
    // };
    // const invoiceId = await TiliaService.processInvoice(invoiceData);
    await ParclePurchaseEntityService.update(parcelPurchase, {
      status: PurchaseStatus.SUCCESS,
    });

    await ParcelEntityService.update(parcel, {
      ownerAddress: user.chainAccount,
      ownerId: user.id,
      status: PropertyStatus.OWNED,
    });
  } catch (e) {
    await ParcelEntityService.update(parcel, { status: oldStatus });
    throw e;
  }
};
const mint = async (parcel: Parcel, user: User) => {
  if (parcel.price === null) throw new ControllerError("Price is null");
  if (parcel.status !== PropertyStatus.UNMINTED)
    throw new ControllerError("This is already minted");

  // Check balance
  const { mmcSpendable } = await TiliaService.getUserBalances(user);
  if (mmcSpendable < parcel.price) {
    throw new ControllerError("Not Enough Balance");
  }

  const oldStatus = parcel.status;
  try {
    await ParcelEntityService.update(parcel, {
      status: PropertyStatus.SECURING,
    });

    const parcelPurchase = await prisma.parcelPurchase.create({
      data: {
        amount: parcel.price,
        fee: 0,
        currency: MMC_CURRENCY,
        buyerId: user.id,
        parcelId: parcel.id,
      },
    });
    await UserSaleService.burnMMC(user, parcelPurchase.amount);
    // const invoiceData = {
    //   account_id: user.tiliaId,
    //   invoice_type: "user_purchase_virtual",
    //   reference_type: "parcel_purchase_id",
    //   reference_id: parcelPurchase.id,
    //   description: `${user.name} mint parcel`,
    //   line_items: [
    //     {
    //       amount: parcel.price,
    //       currency: MMC_CURRENCY,
    //       description: `Parcel Address: ${parcel.address}`,
    //       transaction_type: "user_to_integrator",
    //     },
    //   ],
    // };
    // const invoiceId = await TiliaService.processInvoice(invoiceData);
    // await ParclePurchaseEntityService.update(parcelPurchase, {
    //   invoiceId,
    //   status: PurchaseStatus.SUCCESS,
    // });
    await ParcelEntityService.update(parcel, {
      ownerAddress: user.chainAccount,
      ownerId: user.id,
      status: PropertyStatus.OWNED,
    });
  } catch (e) {
    await ParcelEntityService.update(parcel, { status: oldStatus });
    throw e;
  }
};

export const ParcelSaleService = {
  buy,
  mint,
};
