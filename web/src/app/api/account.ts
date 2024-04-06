import { accountableApi } from ".";

const createAccount = async (displayName: string, description?: string) => {
  await accountableApi.post("/account", {
    displayName,
    description,
  });
};
