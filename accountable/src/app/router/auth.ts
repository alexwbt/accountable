import { User, UserSession } from "@prisma/client";
import express from "express";
import { scheduleJob } from "node-schedule";
import { SESSION_TOKEN_COOKIE_NAME, Token, signToken } from "../../lib/passport";
import { RequestHandlerError, useRequestHandler } from "../../lib/router/useRequestHandler";
import { getEnvBoolean, getEnvString } from "../../lib/util/env";
import { comparePassword } from "../../lib/util/hash";
import logger from "../../lib/util/logger";
import { randomString } from "../../lib/util/random";
import client from "../client";
import { LoginRequestSchema } from "../schema/auth";

export const ACCESS_TOKEN_SECRET = getEnvString("ACCESS_TOKEN_SECRET", randomString(128));
export const SESSION_TOKEN_SECRET = getEnvString("SESSION_TOKEN_SECRET", randomString(128));
const SESSION_ID_CLAIM = "session";

const SESSION_TOKEN_COOKIE_SETTINGS = {
  signed: true,
  httpOnly: true,
  sameSite: "strict",
  maxAge: 2592000000, // 30 days
  domain: getEnvString("COOKIE_DOMAIN", ""),
  secure: getEnvBoolean("COOKIE_HTTPS_ONLY", true),
  path: getEnvString("CONTEXT_PATH", "/"),
} as const;

const authRouter = express.Router();

const authorize = async (
  user: Pick<User, "id" | "data" | "name">,
  session: Pick<UserSession, "id" | "refreshCount">,
  res: express.Response,
) => {
  const roles = typeof user.data === "object" &&
    Array.isArray((user.data as any)?.roles) ? (user.data as any).roles : [];

  const [accessToken, sessionToken] = await Promise.all([
    // sign access token
    signToken(
      {
        roles,
        username: user.name,
        [SESSION_ID_CLAIM]: `${session.id}-${session.refreshCount}`,
      },
      ACCESS_TOKEN_SECRET,
      {
        subject: `${user.id}`,
        expiresIn: "10m",
      }
    ),
    // sign session token
    signToken(
      {
        [SESSION_ID_CLAIM]: `${session.id}-${session.refreshCount}`,
      },
      SESSION_TOKEN_SECRET,
      {
        subject: `${user.id}`,
        expiresIn: "30d",
      }
    ),
  ]);

  res.cookie(SESSION_TOKEN_COOKIE_NAME,
    sessionToken, SESSION_TOKEN_COOKIE_SETTINGS);

  return accessToken;
};

const getSessionId = (token: Token) => token.getClaimRequired<string>(SESSION_ID_CLAIM).split("-");

useRequestHandler({
  router: authRouter,
  path: "/login",
  method: "post",
  bodySchema: LoginRequestSchema,
  requestHandler: async ({ _req, body: { username, password } }, res) => {
    if (_req.user) throw new RequestHandlerError(400, "Called login with token.", "Invalid request.");

    const user = await client.user.findFirst({
      where: { name: username },
      select: { id: true, data: true, name: true, password: true },
    });
    if (!user || !await comparePassword(password, user.password))
      throw new RequestHandlerError(400,
        user ? "Incorrect password." : "User not found.",
        "Invalid credentials.");

    const session = await client.userSession.create({ data: { userId: user.id } });

    return {
      status: 200,
      body: {
        accessToken: await authorize(user, session, res),
      },
    };
  },
});

useRequestHandler({
  router: authRouter,
  path: "/refresh",
  method: "post",
  authorized: true,
  requestHandler: async ({ token }, res) => {
    if (token.getType() !== "session")
      throw new RequestHandlerError(400, "Called refresh with access token.", "Invalid request.");

    try {
      const [sessionId, refreshCount] = getSessionId(token);
      const session = await client.userSession.update({
        where: { id: +sessionId, refreshCount: +refreshCount },
        data: { refreshCount: { increment: 1 } },
        select: { id: true, user: true, refreshCount: true },
      });

      return {
        status: 200,
        body: {
          accessToken: await authorize(session.user, session, res),
        },
      };
    } catch (e) {
      throw new RequestHandlerError(401, `${e}`, "Unauthorized.");
    }
  },
});

useRequestHandler({
  router: authRouter,
  path: "/logout",
  method: "post",
  authorized: true,
  requestHandler: async ({ token }, res) => {
    const [sessionId] = getSessionId(token);
    await client.userSession.delete({
      where: { id: +sessionId },
    });

    res.clearCookie(SESSION_TOKEN_COOKIE_NAME, {
      ...SESSION_TOKEN_COOKIE_SETTINGS,
      maxAge: 0,
    });

    return { status: 200 };
  },
});

// clear sessions older than 30 days
scheduleJob("0 0 * * *", async () => {
  const daysAgo30 = new Date();
  daysAgo30.setDate(daysAgo30.getDate() - 30);

  const result = await client.userSession.deleteMany({
    where: {
      updateTime: {
        lt: daysAgo30,
      },
    },
  });
  logger.info(`Schedule task removed ${result.count} sessions.`);
});

export default authRouter;
