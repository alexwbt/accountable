import axios from "axios";
import { getEnvStringRequired } from "../../lib/util/env";

export const accountableApi = axios.create({
  baseURL: getEnvStringRequired("ACCOUNTABLE_API_BASE_URL"),
  withCredentials: true,
});
