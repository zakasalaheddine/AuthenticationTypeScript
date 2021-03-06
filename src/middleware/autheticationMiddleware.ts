import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "../Context";

declare module 'express' {
    export interface Request{
        isAuthenticated?: Boolean
    }
}

export const authenticationMiddleware: MiddlewareFn<Context> = ( { context }, next ) => {
    const authorization = context.req.headers['authorization'];
    if(!authorization){
        throw new Error("not authenticated");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (error) {
        console.log(error);
        throw new Error("not authenticated");
    }
    return next();
}