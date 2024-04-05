import { TransactionCreateRequestSchema, TransactionSearchQuerySchema, TransactionUpdateRequestSchema } from "../../../app/schema/transaction";
import { Token } from "../../../lib/passport";
import { createCrudRouter } from "../../../lib/router/useCrudRouter";
import { RequestHandlerError } from "../../../lib/router/useRequestHandler";
import client from "../../client";
import { PERMISSION_EDIT, PERMISSION_READ, ROLE_USER } from "../../constants";
import { NumberIdSchema } from "../../schema/id";

const commonWhereClause = (token: Token) => ({
  account: {
    users: {
      some: {
        permission: {
          contains: PERMISSION_READ,
        },
        user: {
          is: {
            id: {
              equals: +token.getClaimRequired<string>("sub"),
            },
          },
        },
      },
    },
  },
});

const checkEditPermission = async (token: Token, accountId: number) => {
  const account = await client.userAccount.findFirst({
    where: { accountId, userId: +token.getClaimRequired<string>("sub") },
  });
  if (!account || !account.permission.includes(PERMISSION_EDIT))
    throw new RequestHandlerError(401, "Permission denied.");
};

const transactionCrudRouter = createCrudRouter(
  NumberIdSchema,
  TransactionSearchQuerySchema,
  TransactionCreateRequestSchema,
  TransactionUpdateRequestSchema,
  {
    select: async (id, token) => await client.transaction.findFirst({
      where: {
        id: +id,
        ...commonWhereClause(token),
      },
    }),
    search: async ({ page, size, accountId }, token) => {
      const where = {
        ...commonWhereClause(token),
        accountId: accountId ? +accountId : undefined,
      };
      const result = await client.$transaction([
        client.transaction.count({ where, }),
        client.transaction.findMany({ where, skip: page * size, take: size, }),
      ]);
      return { page, size, total: result?.[0] || 0, items: result?.[1] || [] };
    },
    create: async (data, token) => {
      await checkEditPermission(token, data.accountId);
      return await client.transaction.create({ data });
    },
    update: async (id, data, token) => {
      const transaction = await client.transaction.findFirst({
        where: { id: +id, ...commonWhereClause(token), },
        select: { id: true, accountId: true, }
      });
      if (!transaction) throw new RequestHandlerError(400, "Item does not exist.");
      await checkEditPermission(token, transaction.accountId);

      return await client.transaction.update({ where: { id: transaction.id }, data, });
    },
    remove: async (id, token) => {
      const transaction = await client.transaction.findFirst({
        where: { id: +id, ...commonWhereClause(token), },
        select: { id: true, accountId: true, }
      });
      if (!transaction) throw new RequestHandlerError(400, "Item does not exist.");
      await checkEditPermission(token, transaction.accountId);

      await client.transaction.delete({ where: { id: transaction.id } });
    },
  },
  true,
  [ROLE_USER],
  [ROLE_USER],
);

export default transactionCrudRouter;
