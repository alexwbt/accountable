import { Prisma, PrismaClient } from "../../../prisma/generated/accountable";
import RequestHandlerError from "../error/RequestHandlerError";

export const createCrudService = <
  Delegate extends Prisma.TypeMap,
  CreateInput,
  UpdateInput,
>(
  client: PrismaClient,
  delegate: Delegate,
) => {
  return {
    select: async (id: string) => {
      const item = await delegate.findFirst({ where: { id: +id } });
      if (!item) throw new RequestHandlerError(400, "Item does not exist.");
      return item;
    },
    search: async (page: number, size: number) => {
      const [total, items] = await client.$transaction([
        delegate.count(),
        delegate.findMany({
          skip: page * size,
          take: size,
        }),
      ]);
      return { total, items };
    },
    create: async (request: CreateInput) =>
      await delegate.create({ data: request }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      }),
    update: async (id: string, request: UpdateInput) =>
      await delegate.update({ where: { id: +id }, data: request }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      }),
    remove: async (id: string) => {
      await delegate.delete({ where: { id: +id } }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      })
    },
  };
};
