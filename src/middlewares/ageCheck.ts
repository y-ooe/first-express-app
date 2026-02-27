import type { Request, Response, NextFunction } from 'express';

export const ageCheck = (req: Request, res: Response, next: NextFunction) => {
    const age = Number(req.query.age);

    if (age >= 20) {
        next();
    } else {
        res.status(401).send('未成年の方は入場できません');
    }
};