import bodyParser from "body-parser";
import express from "express";
import { ENV } from "../lib/util/env";
import logger from "../lib/util/logger";
import accountCrudRouter from "./router/crud/account";
import transactionCrudRouter from "./router/crud/transaction";
import notfoundRouter from "./router/notfound";

const app = express();
app.use(bodyParser.json());

const rootRouter = express.Router();
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
