import { AccountCreateRequestSchema, AccountUpdateRequestSchema } from "../../../app/schema/account";
import { createCrudService } from "../../../lib/prisma/crudService";
import { createCrudRouter } from "../../../lib/router/useCrudRouter";
import client from "../../client";
import { NumberIdSchema } from "../../schema/id";

const accountCrudRouter = createCrudRouter(
  NumberIdSchema,
  AccountCreateRequestSchema,
  AccountUpdateRequestSchema,
  createCrudService(client, client.account),
);

export default accountCrudRouter;
