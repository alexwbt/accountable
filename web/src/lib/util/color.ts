
export const colorFromString = (input: string) => {
  let hashCode = 0;
  for (let i = 0; i < input.length; i++)
    hashCode = input.charCodeAt(i) + ((hashCode << 5) - hashCode);
  return `#${(hashCode & 0x00FFFFFF).toString(16).toUpperCase().padStart(6, "0")}`;
};
