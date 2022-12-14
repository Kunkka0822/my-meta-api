import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../lib/helpers/env";
import { AuthRequest } from "../lib/types/user.types";
import { prisma } from "../models";

export const authorizeUser =
  () => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }

      if (token.toLowerCase().startsWith("bearer")) {
        token = token.slice("bearer".length).trim();
      }
      const { id } = verify(token, env("JWT_SECRET")) as User;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) {
        return res.status(403).json("You are not allowed");
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Expired token" });
        return;
      }
      res.status(500).json({ message: "Failed to authenticate user" });
    }
  };
