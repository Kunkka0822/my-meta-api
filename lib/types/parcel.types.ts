import { Parcel } from "@prisma/client";
import { PagerQuery } from "./common.types";

export interface ParcelRequest {
  handleId: string;
  image: string;
  address: string;
  square: number;
  price: number;
  ownerAddress: string;
  contractAddress: string;
  tokenId: string;
  onSale: boolean;
}

export interface ParcelsByHandleQuery {
  handleIds: string[];
}

export interface ParcelOnSaleRequest {
  price: number;
}
export interface ParcelQuery extends PagerQuery {}

export interface ParcelData extends Partial<Parcel> {}
