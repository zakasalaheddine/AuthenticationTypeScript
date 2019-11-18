import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

declare module 'express' {
    export interface Request{
        isAuthenticated?: Boolean
    }
}

export const authenticationMiddleware = ( req: Request, _: Response, next: NextFunction ) => {
    const authorization = req.headers['authorization'];
    if(!authorization){
        req.isAuthenticated = false;
        return next();
    }

    try {
        const token = authorization.split(" ")[1];
        verify(token, process.env.ACCESS_TOKEN_SECRET!);
        req.isAuthenticated = true;
        return next();
    } catch (error) {
        console.log({ authenticationMiddleware: error })
        req.isAuthenticated = false;
        return next();
    }

}