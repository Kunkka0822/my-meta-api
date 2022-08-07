import { Schema } from "express-validator";
import { PageQuerySchema, RetrieveQuerySchema } from "./common";

export const ParcelQuerySchema: Schema = {
  ...PageQuerySchema,
  // we may add search keyword query for the future
  // search: {
  //     in: ['query'],
  //     optional: { options: { nullable: true}}
  // }
};

export const ParcelRetrieveSchema: Schema = {
  ...RetrieveQuerySchema,
};
export const ParcelBuySchema: Schema = {
  ...RetrieveQuerySchema,
};
export const ParcelsByHandleSchema: Schema = {
  handleIds: {
    in: ["query"],
    isArray: true,
  },
};

export const ParcelCreateSchema: Schema = {
  handleId: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  image: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  address: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  square: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  price: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  ownerAddress: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  contractAddress: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  tokenId: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
  onSale: {
    in: ["body"],
    optional: { options: { nullable: true } },
  },
};

export const ParcelsMakeSaleSchema: Schema = {
  ...RetrieveQuerySchema,
  price: {
    in: ["query"],
    optional: { options: { nullable: true } },
    isInt: {
      errorMessage: "Price should be positive value",
      options: { min: 0 },
    },
    toInt: true,
  },
};
