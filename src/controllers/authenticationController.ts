import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { createAccessToken } from "../authHelpers";
import { User } from "../entity/User";

export const RevokeRefreshToken = (req: Request, _: Response) => {
    console.log(req);
}

export const GetNewAccessTokenFromRefreshToken = async (req: Request, res: Response) => {
    if (req.cookies && req.cookies.jwtid) {
        let user;
        try {
            const paylod: any = verify(req.cookies.jwtid, process.env.REFRESH_TOKEN_SECRET!);
            user = await User.findOne({ where: { id: paylod.id } });
        } catch (error) {
            return res.json({
                error: error,
                data: null
            }).status(401);
        }
        return res.json({
            error: null,
            data: createAccessToken(user!)
        }).status(200);
    }
    return res.json({
        error: 'No Refresh token founded',
        data: null
    }).status(401);
}