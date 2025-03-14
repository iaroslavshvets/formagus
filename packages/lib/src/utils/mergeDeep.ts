/* eslint-disable
 @typescript-eslint/no-unsafe-call,
 @typescript-eslint/no-unsafe-member-access
 */

/**
 * Courtesy of https://github.com/angus-c/just/tree/master/packages/object-extend
 * it's faster version of lodash.merge.
 */

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

function isCloneable(obj: unknown) {
  return Array.isArray(obj) || {}.toString.call(obj) === '[object Object]';
}
function isUnExtendable(val: unknown) {
  return !val || (typeof val !== 'object' && typeof val !== 'function');
}

export function mergeDeep<T>(obj1: T, obj2: DeepPartial<T>): T;
// eslint-disable-next-line no-redeclare
export function mergeDeep(/* [deep], obj1, obj2, [objn] */ ...args: any[]) {
  let deep = false;

  if (typeof args[0] === 'boolean') {
    deep = args.shift();
  }

  const result = args[0] ?? {};

  const extenders = args.slice(1);
  const len = extenders.length;

  for (let i = 0; i < len; i++) {
    const extender = extenders[i];

    for (const key in extender) {
      if (Object.prototype.hasOwnProperty.call(extender, key)) {
        const value = extender[key];
        if (deep && isCloneable(value)) {
          const base = Array.isArray(value) ? [] : {};

          result[key] = (mergeDeep as any)(
            true,

            Object.prototype.hasOwnProperty.call(result, key) && !isUnExtendable(result[key]) ? result[key] : base,
            value,
          );
        } else {
          result[key] = value;
        }
      }
    }
  }
  return result;
}
