import { LocalStorage } from "../lib/util/localStorage";

export type AppStorage = {
  theme: "dark" | "light";
  showSidebar: boolean;
};

export const appStorage = new LocalStorage<AppStorage>("app", {
  theme: "dark",
  showSidebar: true,
});
