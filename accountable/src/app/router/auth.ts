import express from "express";
import { JsonValue } from "../../../prisma/generated/accountable/runtime/library";
import { signToken } from "../../lib/passport";
import { RequestHandlerError, useRequestHandler } from "../../lib/router/useRequestHandler";
import { getEnvBoolean, getEnvString } from "../../lib/util/env";
import { comparePassword } from "../../lib/util/hash";
import { randomString } from "../../lib/util/random";
import client from "../client";
import { LoginRequestSchema } from "../schema/auth";

const ACCESS_TOKEN_SECRET = getEnvString("ACCESS_TOKEN_SECRET", randomString(128));
const SESSION_TOKEN_SECRET = getEnvString("SESSION_TOKEN_SECRET", randomString(128));
const SESSION_TOKEN_COOKIE_NAME = "session_token";
const SESSION_ID_CLAIM = "session";

const authRouter = express.Router();

const authorize = async (
  userId: number,
  sessionId: number,
  data: JsonValue,
  res: express.Response,
) => {
  const roles = typeof data === "object" &&
    Array.isArray((data as any)?.roles) ? (data as any).roles : [];

  const [accessToken, sessionToken] = await Promise.all([
    signToken({ [SESSION_ID_CLAIM]: `${sessionId}`, roles }, ACCESS_TOKEN_SECRET,
      { subject: `${userId}`, expiresIn: "10m" }),
    signToken({ [SESSION_ID_CLAIM]: `${sessionId}` }, SESSION_TOKEN_SECRET,
      { subject: `${userId}`, expiresIn: "30d" }),
  ]);

  res.cookie(SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 2592000000, // 30 days
    domain: getEnvString("COOKIE_DOMAIN", ""),
    secure: getEnvBoolean("COOKIE_HTTPS_ONLY", true),
  });

  return accessToken;
};

useRequestHandler({
  router: authRouter,
  path: "/login",
  noAuth: true,
  method: "post",
  bodySchema: LoginRequestSchema,
  requestHandler: async ({ token, body: { username, password } }, res) => {
    if (token) throw new RequestHandlerError(400, "Invalid request.");

    const user = await client.user.findFirst({
      where: { name: username },
      select: { id: true, data: true, password: true },
    });
    if (!user || !await comparePassword(password, user.password))
      throw new RequestHandlerError(400, "Invalid credentials.");

    const session = await client.userSession.create({ data: { userId: user.id } });

    return {
      status: 200,
      body: {
        accessToken: await authorize(user.id, session.id, user.data, res),
      },
    };
  },
});

useRequestHandler({
  router: authRouter,
  path: "/refresh",
  method: "post",
  requestHandler: async ({ token }, res) => {
    if (token.tokenType !== "session")
      throw new RequestHandlerError(400, "Invalid request.");

    const session = await client.userSession.findFirst({
      where: { id: +token[SESSION_ID_CLAIM] },
      select: { id: true, user: true },
    });
    if (!session) throw new RequestHandlerError(401, "Unauthorized.");

    return {
      status: 200,
      body: {
        accessToken: await authorize(session.user.id, session.id, session.user.data, res),
      },
    };
  },
});

useRequestHandler({
  router: authRouter,
  path: "/logout",
  method: "post",
  requestHandler: async ({ token }, res) => {
    await client.userSession.delete({
      where: { id: +token[SESSION_ID_CLAIM] },
      select: {},
    });

    res.clearCookie(SESSION_TOKEN_COOKIE_NAME);

    return { status: 200 };
  },
});

export default authRouter;
