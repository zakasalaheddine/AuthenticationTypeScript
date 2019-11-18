import { Request, Response } from 'express';

export interface Context {
    req: Request,
    res: Response,
    payload?: {
        id: String | Number,
        username: String
    }
}