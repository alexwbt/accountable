import { LocalStorage } from "../lib/util/localStorage";

export type AppStorage = {
  theme: "dark" | "light";
};

export const appStorage = new LocalStorage<AppStorage>("app", {
  theme: "dark",
});
