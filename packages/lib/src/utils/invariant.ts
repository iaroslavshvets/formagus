export const invariant = (condition: unknown, message: string): condition is true => {
  if (condition === false || condition === undefined) {
    throw new Error(message);
  }
  return true;
};
