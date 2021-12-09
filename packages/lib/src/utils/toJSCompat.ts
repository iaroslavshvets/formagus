import {toJS as mobxToJs} from 'mobx';

export const toJSCompat = (() => {
  try {
    (mobxToJs as any)({}, {detectCycles: true});
    return (value: any, detectCycles?: boolean) => {
      return (mobxToJs as any)(value, {detectCycles});
    };
  } catch (e) {
    return (value: any) => {
      return mobxToJs(value);
    };
  }
})();
