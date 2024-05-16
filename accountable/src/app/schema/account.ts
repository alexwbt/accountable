import { Prisma } from "@prisma/client";
import Joi from "joi";

export const AccountCreateRequestSchema = Joi.object<Prisma.AccountCreateInput>({
  displayName: Joi.string().required().max(50),
  description: Joi.string(),
});

export const AccountUpdateRequestSchema = Joi.object<Prisma.AccountUpdateInput>({
  displayName: Joi.string().max(50),
  description: Joi.string(),
});
