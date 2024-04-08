import { UserCreateRequestSchema, UserUpdateRequestSchema } from "../../../app/schema/user";
import { BaseSearchQuerySchema, createCrudRouter } from "../../../lib/router/useCrudRouter";
import { hashPassword } from "../../../lib/util/hash";
import client from "../../client";
import { ROLE_ADMIN, ROLE_USER } from "../../constants";
import { NumberIdSchema } from "../../schema/id";

const commonSelect = () => ({
  id: true,
  updateTime: true,
  createTime: true,
  name: true,
  data: true,
});

const userCrudRouter = createCrudRouter(
  NumberIdSchema,
  BaseSearchQuerySchema,
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  {
    select: async id => await client.user.findFirst({
      where: { id: +id, },
      select: commonSelect(),
    }),
    search: async ({ page, size }) => {
      const [total, items] = await client.$transaction([
        client.user.count(),
        client.user.findMany({
          skip: page * size,
          take: size,
          select: commonSelect(),
        }),
      ]);
      return { page, size, total, items };
    },
    create: async request => await client.user.create({
      data: {
        name: request.name,
        password: await hashPassword(request.password),
        data: {
          roles: request.roles,
        },
      },
      select: commonSelect(),
    }),
    update: async (id, request) => await client.user.update({
      where: { id: +id },
      data: {
        password: request.password && await hashPassword(request.password),
        data: request.roles && {
          roles: request.roles,
        },
      },
      select: commonSelect(),
    }),
    remove: async id => {
      await client.user.delete({ where: { id: +id, } });
    },
  },
  true,
  [ROLE_ADMIN],
  [ROLE_ADMIN],
);

export default userCrudRouter;
