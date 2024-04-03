import { TransactionCreateRequestSchema, TransactionUpdateRequestSchema } from "../../../app/schema/transaction";
import { Token } from "../../../lib/passport";
import { createCrudRouter } from "../../../lib/router/useCrudRouter";
import { RequestHandlerError } from "../../../lib/router/useRequestHandler";
import client from "../../client";
import { PERMISSION_EDIT, ROLE_USER } from "../../constants";
import { NumberIdSchema } from "../../schema/id";

const commonWhereClause = (token: Token) => ({
  account: {
    users: {
      some: {
        user: {
          id: +token.getClaimRequired<string>("subject"),
        },
      },
    },
  },
});

const transactionCrudRouter = createCrudRouter(
  NumberIdSchema,
  TransactionCreateRequestSchema,
  TransactionUpdateRequestSchema,
  {
    select: async (id, token) => await client.transaction.findFirst({
      where: {
        id: +id,
        ...commonWhereClause(token),
      },
    }),
    search: async (page, size, token) => {
      const result = await client.$transaction([
        client.transaction.count({ where: commonWhereClause(token), }),
        client.transaction.findMany({ where: commonWhereClause(token), skip: page * size, take: size, }),
      ]);
      return { page, size, total: result?.[0] || 0, items: result?.[1] || [] };
    },
    create: async (data, token) => {
      const account = await client.userAccount.findFirst({
        where: { accountId: data.accountId, userId: +token.getClaimRequired<string>("subject") },
      });
      if (!account || !account.permission.includes(PERMISSION_EDIT))
        throw new RequestHandlerError(401, "Permission denied.");

      return await client.transaction.create({ data });
    },
    update: async (id, data, token) => await client.transaction.update({
      where: { id: +id, ...commonWhereClause(token), }, data,
    }),
    remove: async (id, token) => {
      await client.transaction.delete({ where: { id: +id, ...commonWhereClause(token), } });
    },
  },
  true,
  [ROLE_USER],
  [ROLE_USER],
);

export default transactionCrudRouter;
