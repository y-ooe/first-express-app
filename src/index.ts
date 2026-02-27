import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import { ageCheck } from './middlewares/ageCheck.js';
import { authGuard } from './middlewares/authGurard.js';

const app: Express = express()
const port = 3000

// 自作ミドルウェア：ロガー
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // これを忘れると、ブラウザの読み込みが止まったままになります！
};

// 全てのルートに適用する
app.use(loggerMiddleware);



app.get('/', (req: Request, res: Response) => {
  res.send('TOPページです');
});

app.get('/beer',ageCheck, (req: Request, res: Response) => {
  res.send("ビールどうぞ！");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// /secret ページにだけ authGuard を適用する
app.get('/secret', authGuard, (req: Request, res: Response) => {
  res.send('合言葉が正解です！秘密の情報：TypeScriptは楽しい！');
});

