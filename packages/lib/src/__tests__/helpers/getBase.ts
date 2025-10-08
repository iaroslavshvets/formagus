export const getBase = (wrapper: Element, dataHook: string) => {
  return wrapper.querySelector(`[data-hook="${dataHook}"]`)!;
};
