import { Prisma, PrismaClient } from "../../../../prisma/generated/accountable";
import { AccountCreateRequestSchema, AccountIdSchema, AccountUpdateRequestSchema } from "../../../app/schema/account";
import RequestHandlerError from "../../../lib/error/RequestHandlerError";
import { createCrudRouter } from "../../../lib/router/useCrudRouter";

const client = new PrismaClient();

const accountCrudRouter = createCrudRouter(
  AccountIdSchema,
  AccountCreateRequestSchema,
  AccountUpdateRequestSchema,
  {
    select: async (id: string) => {
      const item = await client.account.findFirst({ where: { id: +id } });
      if (!item) throw new RequestHandlerError(400, "Item does not exist.");
      return item;
    },
    search: async (page: number, size: number) => {
      const [total, items] = await client.$transaction([
        client.account.count(),
        client.account.findMany({
          skip: page * size,
          take: size,
        }),
      ]);
      return { total, items };
    },
    create: async (request: Prisma.AccountCreateInput) =>
      await client.account.create({ data: request }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      }),
    update: async (id: string, request: Prisma.AccountUpdateInput) =>
      await client.account.update({ where: { id: +id }, data: request }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      }),
    remove: async (id: string) => {
      await client.account.delete({ where: { id: +id } }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      })
    },
  }
);

export default accountCrudRouter;


