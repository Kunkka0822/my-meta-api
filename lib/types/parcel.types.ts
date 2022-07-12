import Parcel from "../../models/parcel";
import { PagerQuery } from "./common.types";

export interface ParcelRequest {
    id: string;
    image: string;
    address: string;
    square: number;
    price: number;
    ownerAddress: string;
    contractAddress: string;
    tokenId: string;
    onSale: boolean;
}

export interface ParcelQuery extends PagerQuery {}