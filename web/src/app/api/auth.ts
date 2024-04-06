import { accountableApi } from ".";

export const login = async (username: string, password: string) => {
  const res = await accountableApi.post("/auth/login", {
    username,
    password,
  });
  return `${res.data.accessToken}`;
};

export const refresh = async () => {
  const res = await accountableApi.post("/auth/refresh");
  return `${res.data.accessToken}`;
};

export const logout = async () => {
  await accountableApi.post("/auth/logout");
};
