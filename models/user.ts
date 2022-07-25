import { User } from "@prisma/client";
import _ from "lodash";
import { convertUnserializable } from ".";

export const userResponse = (user: User) => {
    return _.omit(convertUnserializable(user), 'password')
}