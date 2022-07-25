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
    handleIds: string[]
}

export interface ParcelBoughtRequest {
    ownerAddress: string
}
export interface ParcelQuery extends PagerQuery {}