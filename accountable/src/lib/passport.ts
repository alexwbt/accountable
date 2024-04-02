import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { Authenticator } from "passport";
import passportJWT from "passport-jwt";
import { randomString } from "./util/random";

export type Token = {
  [claim: string]: any;
  tokenType: "access" | "session";
};

export const signToken = (payload: any, secret: string, options?: SignOptions): Promise<string> => {
  return new Promise((resolve, reject) => jwt.sign(
    payload, secret, { ...options },
    (err, encoded) => {
      if (err || !encoded) reject(err);
      else resolve(encoded);
    }
  ));
};

export const parseToken = <T>(token: string, secret: string, options?: VerifyOptions): Promise<T> => {
  return new Promise((resolve, reject) => jwt.verify(
    token, secret, { ...options },
    (err, decoded: any) => {
      if (err || !decoded) reject(err);
      else resolve(decoded);
    }
  ));
};

export const requireAuth = (require: boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (require && !req.user)
      res.status(401).send({ message: "Unauthorized." });
    else
      next();
  };

export const useAuthenticator = (
  passport: Authenticator,
  accessTokenSecret = randomString(128),
  sessionTokenSecret = randomString(128),
) => {
  // Extract access token from request header "Authorization" as Bearer token
  passport.use("jwt-header", new passportJWT.Strategy({
    secretOrKey: accessTokenSecret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload: { id: Number }, done) => {
    done(null, { tokenType: "access", ...payload });
  }));

  // Extract session token from request cookies
  passport.use("jwt-cookie", new passportJWT.Strategy({
    secretOrKey: sessionTokenSecret,
    jwtFromRequest: req => req && req.signedCookies && req.signedCookies["session_token"]
  }, async (payload: { id: Number }, done) => {
    done(null, { tokenType: "session", ...payload });
  }));

  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      ["jwt-header", "jwt-cookie"],
      { session: false },
      (_err: any, user: any, _info: any) => {
        req.user = user;
        next();
      },
    )(req, res, next);
  };
};
