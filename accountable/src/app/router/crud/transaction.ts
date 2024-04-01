import { TransactionCreateRequestSchema, TransactionUpdateRequestSchema } from "../../../app/schema/transaction";
import { createCrudService } from "../../../lib/prisma/crudService";
import { createCrudRouter } from "../../../lib/router/useCrudRouter";
import client from "../../client";
import { NumberIdSchema } from "../../schema/id";

const transactionCrudRouter = createCrudRouter(
  NumberIdSchema,
  TransactionCreateRequestSchema,
  TransactionUpdateRequestSchema,
  createCrudService(client, client.transaction),
);

export default transactionCrudRouter;
