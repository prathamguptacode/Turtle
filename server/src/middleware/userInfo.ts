import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/enviromentType.js';

export async function userInfo(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.refreshToken) {
        return res.status(400).json({ message: 'please log in to continue' });
    }
    let userId = '';
    try {
        const token = jwt.verify(
            req.cookies.refreshToken,
            env.REFRESHTOKEN,
        ) as jwt.JwtPayload;
        userId = token.user;
    } catch (error) {
        return res.status(400).json({ message: 'token corrupted' });
    }
    req.user = userId;
    next();
}
