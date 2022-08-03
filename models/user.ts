import { User, UserOnline, UserSkin, UserTravel } from "@prisma/client";
import _ from "lodash";
import { convertUnserializable } from ".";

type UserProfile = User & {
  userOnline?: UserOnline;
  userSkin?: UserSkin;
  userTravel?: UserTravel;
};
export const userResponse = (user?: User | null) => {
  if (!user) return user;
  return _.omit(convertUnserializable(user), "password");
};
export const sessionResponse = (user: UserProfile) => {
  const userProfile = _.omit(convertUnserializable(user), "password");
  return {
    main: _.omit(userProfile, "userOnline", "userSkin", "userTravel"),
    online: userProfile.userOnline,
    skin: userProfile.userSkin,
    travel: userProfile.userTravel,
  };
};

export const webSessionResponse = (user: User) => ({
  id: user.id.toString(),
  name: user.name,
});
