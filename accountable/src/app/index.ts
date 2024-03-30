import bodyParser from "body-parser";
import express from "express";
import logger from "../lib/util/logger";
import notfoundRouter from "./router/notfound";
import { ENV } from "../lib/util/env";
import accountCrudRouter from "./router/crud/account";

const app = express();
app.use(bodyParser.json());

const rootRouter = express.Router();
rootRouter.use("/account", accountCrudRouter);
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
