import { User, UserOnline, UserSkin, UserTravel } from "@prisma/client";
import _ from "lodash";
import { convertUnserializable } from ".";

type UserProfile = User & {
  userOnline?: UserOnline;
  userSkin?: UserSkin;
  userTravel?: UserTravel;
};

export type BalancesType = {
  usd: number;
  mmcConvertible: number;
  mmcSpendable: number;
};
export const userResponse = (user?: User | null) => {
  if (!user) return user;
  return _.omit(convertUnserializable(user), "password", "role");
};
export const sessionResponse = (user: UserProfile, balances: BalancesType) => {
  const userProfile = _.omit(convertUnserializable(user), "password");
  return {
    main: _.omit(userProfile, "userOnline", "userSkin", "userTravel", "role"),
    online: userProfile.userOnline,
    skin: userProfile.userSkin,
    travel: userProfile.userTravel,
    balances,
  };
};

export const webSessionResponse = (user: User, balances: BalancesType) => ({
  id: user.id.toString(),
  name: user.name,
  balances,
});
