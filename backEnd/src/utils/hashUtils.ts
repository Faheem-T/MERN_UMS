import { genSaltSync, hashSync, compareSync } from "bcrypt";

const SALT_ROUNDS = 10;
export const generateHash = (input: string) => {
  const salt = genSaltSync(SALT_ROUNDS);
  return hashSync(input, salt);
};

export const compareWithHash = (input: string, hash: string) => {
  return compareSync(input, hash);
};
