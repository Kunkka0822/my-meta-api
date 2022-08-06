import { Parcel, User } from "@prisma/client";
import { convertUnserializable } from ".";
import { userResponse } from "./user";

type ParcleWithOwner = Parcel & {
  owner?: User | null;
};

export const parcelResponse = (
  parcel: ParcleWithOwner | ParcleWithOwner[]
): any => {
  if (Array.isArray(parcel)) {
    return parcel.map((item) => parcelResponse(item));
  } else {
    return convertUnserializable({
      ...parcel,
      owner: userResponse(parcel.owner),
    });
  }
};
