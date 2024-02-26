export const isSomeStringEnum = <T>(
  e: T,
  token: unknown,
): token is T[keyof T] =>
  Object.values(e as object).includes(token as T[keyof T]);

export const guardStringEnum = <T>(e: T, token: string): T[keyof T] => {
  if (!isSomeStringEnum(e, token)) {
    throw new Error(`${token} is not enum ${e}`);
  }

  return token;
};

export function exhaustiveCheck(_param: never): void {
  return undefined;
}
