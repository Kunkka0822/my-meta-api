import { Schema } from "express-validator";

export const TokenPurchaseStep1Schema: Schema = {
    tokenProductId: {
        in: ['body']
    }
}