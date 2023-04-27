export const invariant = (condition: any, message: string): void => {
  switch (condition) {
    case false:
    case undefined: {
      return;
    }
    default: {
      throw new Error(message);
    }
  }
};
