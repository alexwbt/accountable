import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = (plainPassword: string) =>
  bcrypt.hash(plainPassword, SALT_ROUNDS);

export const checkPassword = (plainPassword: string, hashPassword: string) =>
  bcrypt.compare(plainPassword, hashPassword);
