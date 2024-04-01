
export const randomString = (
  length: number,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~",
): string => {
  return Array(length).fill(0).reduce(s => s + chars[Math.floor(Math.random() * chars.length)], "");
};
