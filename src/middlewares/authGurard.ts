import type { Request, Response, NextFunction } from 'express';


// 認証チェック用ミドルウェア（仮）
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    // URLの最後に ?key=secret123 がついているかチェック
    if (query.key === 'secret123') {
        next(); // 合言葉が合っていれば次へ
    } else {
        res.status(403).send('禁止されています：合言葉が違います'); // 追い返す
    }
};