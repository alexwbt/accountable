import { Prisma } from "../../../prisma/generated/accountable";
import Joi from "joi";

export const AccountIdSchema = Joi.object<{ id: string }>({
  id: Joi.number().min(1).required(),
});

export const AccountCreateRequestSchema = Joi.object<Prisma.AccountCreateInput>({
  displayName: Joi.string().required().max(25),
  description: Joi.string(),
});

export const AccountUpdateRequestSchema = Joi.object<Prisma.AccountUpdateInput>({
  displayName: Joi.string().max(25),
  description: Joi.string(),
});
