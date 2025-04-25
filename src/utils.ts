export const stringifyBigInt = (key: string, value: any) =>
  typeof value === "bigint" ? value.toString() : value;
