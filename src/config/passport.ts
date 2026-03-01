// src/config/passport.ts
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

// 1. .envの内容をロードする
dotenv.config();

// 2. 環境変数を取得（もし未定義ならエラーにするなど、安全策をとる）
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
        // 認証成功時に呼ばれる。今はそのままプロフィールを返す
        return done(null, profile);
    }
));

// passportの設定自体をエクスポートする
export default passport;