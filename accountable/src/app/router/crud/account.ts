import { AccountCreateRequestSchema, AccountUpdateRequestSchema } from "../../../app/schema/account";
import { Token } from "../../../lib/passport";
import { BaseSearchQuerySchema, createCrudRouter } from "../../../lib/router/useCrudRouter";
import client from "../../client";
import { PERMISSION_DELIMITER, PERMISSION_EDIT, PERMISSION_READ, ROLE_USER } from "../../constants";
import { NumberIdSchema } from "../../schema/id";

const commonWhereClause = (token: Token) => ({
  users: {
    some: {
      user: {
        is: {
          id: {
            equals: +token.getClaimRequired<string>("sub"),
          },
        },
      },
    },
  },
});

const accountCrudRouter = createCrudRouter(
  NumberIdSchema,
  BaseSearchQuerySchema,
  AccountCreateRequestSchema,
  AccountUpdateRequestSchema,
  {
    select: async (id, token) => await client.account.findFirst({
      where: {
        id: +id,
        ...commonWhereClause(token),
      },
    }),
    search: async ({ page, size }, token) => {
      const result = await client.$transaction([
        client.account.count({ where: commonWhereClause(token), }),
        client.account.findMany({ where: commonWhereClause(token), skip: page * size, take: size, }),
      ]);
      return { page, size, total: result?.[0] || 0, items: result?.[1] || [] };
    },
    create: async (data, token) => {
      const account = await client.account.create({ data });
      await client.userAccount.create({
        data: {
          userId: +token.getClaimRequired<string>("sub"),
          accountId: account.id,
          permission: [PERMISSION_EDIT, PERMISSION_READ].join(PERMISSION_DELIMITER),
        },
      });
      return account;
    },
    update: async (id, data, token) => await client.account.update({
      where: { id: +id, ...commonWhereClause(token), }, data,
    }),
    remove: async (id, token) => {
      await client.account.delete({ where: { id: +id, ...commonWhereClause(token), } });
    },
  },
  true,
  [ROLE_USER],
  [ROLE_USER],
);

export default accountCrudRouter;
