import { PagerQueryType } from "../types/common";
import { Types } from "mongoose";

const DEFAULT_PAGE_SIZE = 20;

export const searchRegex = (pattern: string) => new RegExp(`.*${pattern}.*`);
export const sanitizePager = (query: PagerQueryType): PagerQueryType => {
    let { page, size } = query;
    if (!page) page = 1;
    if (!size) size = DEFAULT_PAGE_SIZE;
    return {page, size}
}
export const toObjectId = (data: string): Types.ObjectId => {
    return new Types.ObjectId(data);
}
export const randomKey = (len: number = 10) => {
    return Math.random().toString(36).slice(2, 2 + len);
}