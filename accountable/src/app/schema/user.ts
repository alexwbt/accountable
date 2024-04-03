import Joi from "joi";

export type UserCreateRequest = {
  name: string;
  password: string;
  roles: string[];
};
export const UserCreateRequestSchema = Joi.object<UserCreateRequest>({
  name: Joi.string().required().max(50),
  password: Joi.string().required().max(50),
});

export type UserUpdateRequest = {
  password?: string;
  roles?: string[];
};
export const UserUpdateRequestSchema = Joi.object<UserUpdateRequest>({
  password: Joi.string().max(50),
});
