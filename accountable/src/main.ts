import schedule from "node-schedule";
import startApp from "./app";
import { getEnvNumber, getEnvString } from "./lib/util/env";

const PORT = getEnvNumber("PORT", 3000);
const CONTEXT_PATH = getEnvString("CONTEXT_PATH", "/");

startApp(PORT, CONTEXT_PATH);

process.on("SIGINT", async () => {
  await schedule.gracefulShutdown();
  process.exit(0);
});
