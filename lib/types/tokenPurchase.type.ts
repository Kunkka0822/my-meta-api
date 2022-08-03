import { TokenPurchase } from "@prisma/client";

export type TokenPurchaseData = Partial<TokenPurchase>

export type TokenPurchaseStep1Request = {
    tokenProductId: string
}