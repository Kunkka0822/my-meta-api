import { PurchaseStatus } from "@prisma/client";
import {
  TokenPurchaseStep1Request,
  TokenPurchaseStep2Request,
} from "../lib/types/tokenPurchase.type";
import { AuthRequest } from "../lib/types/user.types";
import { prisma } from "../models";
import { TiliaService } from "../services/tilia.service";
import { TokenPurchaseEntityService } from "../services/tokenPurchase.entity.service";
import { UserSaleService } from "../services/user.sale.service";

export const PaymentController = {
  tokenPurchaseStep1: async (req: AuthRequest) => {
    const user = req.user;
    const data = req.body as TokenPurchaseStep1Request;
    const tokenProduct = await prisma.tokenProduct.findFirstOrThrow({
      where: { id: Number(data.tokenProductId) },
    });
    const tokenPurchase = await prisma.tokenPurchase.create({
      data: {
        amount: tokenProduct.amount,
        price: tokenProduct.price,
        currency: tokenProduct.currency,
        tokenProductId: tokenProduct.id,
        buyerId: user.id,
        status: "INITIAL",
      },
    });
    const redirect = await TiliaService.authorizeUser(user);

    return {
      redirect,
      tokenPurchaseId: tokenPurchase.id.toString(),
    };
  },
  tokenPurchaseStep2: async (req: AuthRequest) => {
    const user = req.user;
    const data = req.body as TokenPurchaseStep2Request;
    const tokenPurchase = await prisma.tokenPurchase.findFirstOrThrow({
      where: {
        id: Number(data.tokenPurchaseId),
        buyerId: user.id,
      },
      include: {
        buyer: true,
      },
    });
    await TokenPurchaseEntityService.update(tokenPurchase, {
      paymentMethodId: data.paymentMethodId,
    });
    await TiliaService.purchaseToken(tokenPurchase);
    await TokenPurchaseEntityService.update(tokenPurchase, {
      status: PurchaseStatus.SUCCESS,
    });
    await UserSaleService.transferMMC(user, tokenPurchase.amount);
  },
  getRedirectUrl: async (req: AuthRequest) => {
    const user = req.user;
    const redirect = await TiliaService.authorizeUser(user);
    return {
      redirect,
    };
  },
};
