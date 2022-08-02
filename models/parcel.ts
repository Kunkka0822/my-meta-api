import { Parcel, User } from "@prisma/client";
import _ from "lodash";
import { userResponse } from "./user";
import { convertUnserializable } from ".";

type ParcleWithOwner = Parcel & {
    owner?: User
}

export const parcelResponse = (parcel: ParcleWithOwner) => {
    return convertUnserializable({...parcel, owner: userResponse(parcel.owner)});
}
