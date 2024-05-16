import Joi from "joi";
import { Prisma } from "@prisma/client";
import { BaseSearchQuery } from "../../lib/router/useCrudRouter";

export const TransactionCreateRequestSchema = Joi.object<Prisma.TransactionUncheckedCreateInput>({
  note: Joi.string().max(50),
  detail: Joi.string(),
  amount: Joi.number().required(),
  executionTime: Joi.string().isoDate(),
  interval: Joi.number(),
  accountId: Joi.number().required().min(1),
});

export const TransactionUpdateRequestSchema = Joi.object<Prisma.TransactionUpdateInput>({
  note: Joi.string().max(50),
  detail: Joi.string(),
  amount: Joi.number(),
  executionTime: Joi.string().isoDate(),
  interval: Joi.number(),
});

export const TransactionSearchQuerySchema = Joi.object<BaseSearchQuery & { accountId: string | undefined; }>({
  accountId: Joi.number().min(1),
});
