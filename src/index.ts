import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import type { Express, Request, Response, NextFunction } from 'express';
import { ageCheck } from './middlewares/ageCheck.js';
import { authGuard } from './middlewares/authGurard.js';
import { authSession } from './middlewares/authSession.js';

const app: Express = express()
const port = 3000

// 自作ミドルウェア：ロガー
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // これを忘れると、ブラウザの読み込みが止まったままになります！
};

// 1. セッションの設定（passportより先に書く！）
app.use(session({
  secret: 'secret-key-y_ooe', // 適当な長い文字列でOK（本来は.envへ）
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false } // 開発中はsecure: falseでOK
}));

// 全てのルートに適用する
app.use(loggerMiddleware);
app.use(cookieParser()); // これで req.cookies が使えるようになる
app.use(passport.initialize()); // パスポートを初期化
app.use(passport.session());


app.get('/', (req: Request, res: Response) => {
  res.send('TOPページです');
});

app.get('/success', (req: Request, res: Response) => {
  res.send('認証成功');
});

app.get('/beer', ageCheck, (req: Request, res: Response) => {
  res.send("ビールどうぞ！");
});

// /secret ページにだけ authGuard を適用する
app.get('/secret', authGuard, (req: Request, res: Response) => {
  res.send('合言葉が正解です！秘密の情報：TypeScriptは楽しい！');
});


// クッキーをセットするルート
app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'y_ooe', { httpOnly: true }); // 安全な設定でクッキーを焼く
  res.send('クッキーを保存しました！');
});

// クッキーを読み取るルート
app.get('/get-cookie', (req, res) => {
  const name = req.cookies.username;
  res.send(`こんにちは、${name || '名無し'} さん`);
});


// 練習２
app.get('/login', (req, res) => {
  const password = req.query.pass;

  if (password === "password123") {
    res.cookie('user_role', 'vip', { httpOnly: true });
    res.send('ログイン成功！');
  } else {
    res.send('ログインに失敗しました。');
  }
});

app.get('/dashboard', authSession, (req, res) => {
  res.send('VIPラウンジへようこそ！');
})


// 1.GitHubログイン画面へ飛ばす
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// 2.GitHubから帰ってくる場所(callback)
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/success'); //成功したらトップページへ
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});