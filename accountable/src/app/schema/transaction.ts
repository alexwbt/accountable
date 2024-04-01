import Joi from "joi";
import { Prisma } from "../../../prisma/generated/accountable";

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
