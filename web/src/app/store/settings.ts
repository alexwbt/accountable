import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appStorage } from "../localStorage";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: appStorage.getItem("theme") as "dark" | "light",
  },
  reducers: {
    setTheme: (state, { payload }: PayloadAction<"dark" | "light">) => {
      state.theme = payload;
      appStorage.setItem("theme", payload);
    },
  },
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
