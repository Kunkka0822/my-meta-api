import { TiliaService } from "../services/tilia.service";
import { AuthRequest } from "../lib/types/user.types";
import { Request } from "express";

export const PaymentController = {
    getRedirectUrl: async (req: AuthRequest) => {
        const user = req.user;
        const redirect = await TiliaService.authorizeUser(user);
        return {
            redirect
        }
    }
}