import { Schema } from "express-validator";

export const TokenPurchaseStep1Schema: Schema = {
  tokenProductId: {
    in: ["body"],
  },
};

export const TokenPurchaseStep2Schema: Schema = {
  tokenPurchaseId: {
    in: ["body"],
  },
  paymentMethodId: {
    in: ["body"],
  },
};
