import { PagerQuery } from "../types/common.types";

const DEFAULT_PAGE_SIZE = 20;

export const searchRegex = (pattern: string) => new RegExp(`.*${pattern}.*`);
export const sanitizePager = (
  query: PagerQuery
): { page: number; size: number } => {
  let { page, size } = query;
  if (!page) page = 1;
  if (!size) size = DEFAULT_PAGE_SIZE;
  return { page, size };
};
export const randomKey = (len: number = 10) => {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len);
};

export const generateToken = () => {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000)
    .toString(36)
    .substr(0, 10);
};
