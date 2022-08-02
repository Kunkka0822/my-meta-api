import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const convertUnserializable = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => convertUnserializable(item));
  } else if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'bigint') {
        data[key] = data[key].toString();
      } else if (typeof data[key] === 'object') {
        data[key] = convertUnserializable(data[key])
      }
    })
    return data;
  }
  return data;
}
