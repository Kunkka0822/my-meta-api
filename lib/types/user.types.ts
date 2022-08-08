import { User } from "@prisma/client";
import { Request } from "express";

export type LoginRequest = {
  email: string;
  password: string;
};
export type RegisterRequest = LoginRequest & {
  name: string;
};

export type AuthRequest = Request & {
  user: User;
};

export type UserData = Partial<User>;

export type UserOnlineRequest = {
  loc0: number;
  loc1: number;
  state: string;
};

export type UserSkinRequest = {
  color: number;
  hat: number;
  shoes: number;
  torso: number;
};

export type UserTravelRequest = {
  dateEnd: number;
  dateStart: number;
  distance: number;
  gasStart: number;
  isTravel: number;
  loc0: string;
  loc1: string;
  speed: number;
};
