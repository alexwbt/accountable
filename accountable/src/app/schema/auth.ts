import Joi from "joi";

export type LoginRequest = {
  username: string;
  password: string;
};
export const LoginRequestSchema = Joi.object<LoginRequest>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
