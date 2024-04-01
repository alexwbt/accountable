import Joi from "joi";

export const NumberIdSchema = Joi.object<{ id: string }>({
  id: Joi.number().min(1).required(),
});
