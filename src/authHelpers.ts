import { User } from "./entity/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";

export const createAccessToken = (user: User) => {
    return sign({
            id: user.id,
            username: user.username
        }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '30min'
        });
}

export const createRefreshToken = (user: User) => {
    return sign({
            id: user.id,
            username: user.username
        }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: '7d'
        });
}

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie('jwtid', token)
}