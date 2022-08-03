import { TokenPurchaseStep1Request } from "../lib/types/tokenPurchase.type";
import { AuthRequest } from "../lib/types/user.types";
import { prisma } from "../models";
import { TiliaService } from "../services/tilia.service";

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
  getRedirectUrl: async (req: AuthRequest) => {
    const user = req.user;
    const redirect = await TiliaService.authorizeUser(user);
    return {
      redirect,
    };
  },
};
