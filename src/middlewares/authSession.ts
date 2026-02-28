import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

export const authSession = (req:Request, res:Response, next:NextFunction) => {
    const userRole = req.cookies.user_role;

    if (userRole === "vip") {
        next();
    } else {
        res.status(403).send('会員証がありません');
    }
};