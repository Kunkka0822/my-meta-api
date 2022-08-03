import { Parcel, User } from "@prisma/client";
import { convertUnserializable } from ".";
import { userResponse } from "./user";

type ParcleWithOwner = Parcel & {
  owner?: User | null;
};

export const parcelResponse = (parcel: ParcleWithOwner) => {
  return convertUnserializable({
    ...parcel,
    owner: userResponse(parcel.owner),
  });
};
