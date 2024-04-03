import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import { ENV, getEnvString } from "../lib/util/env";
import logger from "../lib/util/logger";
import { randomString } from "../lib/util/random";
import authRouter, { ACCESS_TOKEN_SECRET, SESSION_TOKEN_SECRET } from "./router/auth";
import accountCrudRouter from "./router/crud/account";
import transactionCrudRouter from "./router/crud/transaction";
import userCrudRouter from "./router/crud/user";
import notfoundRouter from "./router/notfound";
import { useAuthenticator } from "../lib/passport";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(getEnvString("COOKIE_SECRET", randomString(128))));
app.use(useAuthenticator(ACCESS_TOKEN_SECRET, SESSION_TOKEN_SECRET));

const rootRouter = express.Router();
rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userCrudRouter);
rootRouter.use("/account", accountCrudRouter);
rootRouter.use("/transaction", transactionCrudRouter);
rootRouter.use(notfoundRouter);

const startApp = (
  port: number,
  contextPath: string,
) => {
  app.use(contextPath, rootRouter);

  app.listen(port, () => {
    logger.info(`Running Server. (PORT: ${port}, `
      + `CONTEXT_PATH: ${contextPath}, `
      + `LOG_LEVEL: ${logger.level}, `
      + `ENV: ${ENV})`);
  });
};

export default startApp;
