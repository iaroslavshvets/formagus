type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const assign = <T extends Record<string, unknown>>(object: T, props: DeepPartial<T>): T => {
  return Object.assign(object, props);
};
