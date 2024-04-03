import { PrismaClient } from "../prisma/generated/accountable";
import { ROLE_ADMIN, ROLE_USER } from "./app/constants";
import { hashPassword } from "./lib/util/hash";

const client = new PrismaClient();

(async () => {
  await client.user.create({
    data: {
      name: "admin",
      password: await hashPassword("changeme"),
      data: {
        roles: [ROLE_ADMIN, ROLE_USER],
      },
    },
  });
})();
