import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: "",
    username: "",
    userId: 0,
    roles: [] as string[],
  },
  reducers: {
    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;

      if (state.accessToken) {
        const tokenPayload = jwtDecode<{
          sub?: string;
          username?: string;
          roles?: string[];
        }>(state.accessToken);
        state.username = tokenPayload.username || "";
        state.userId = +tokenPayload.sub! || 0;
        state.roles = tokenPayload.roles || [];
      } else {
        state.username = "";
        state.userId = 0;
        state.roles = [];
      }
    },
  },
});

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;
