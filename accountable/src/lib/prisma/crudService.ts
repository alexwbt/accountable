import { PrismaClient } from "../../../prisma/generated/accountable";
import { RequestHandlerError } from "../router/useRequestHandler";

export const createCrudService = (
  client: PrismaClient,
  delegate: any,
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
      return { page, size, total, items };
    },
    create: async (request: any) =>
      await delegate.create({ data: (request as any) }).catch(() => {
        throw new RequestHandlerError(400, "Invalid request.");
      }),
    update: async (id: string, request: any) =>
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
