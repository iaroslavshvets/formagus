export const invariant = (condition: any, message: string): condition is true => {
  if (condition === false || condition === undefined) {
    throw new Error(message);
  }
  return true;
};
