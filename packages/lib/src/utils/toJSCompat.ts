import {toJS} from 'mobx';

export const toJSCompat = (() => {
  try {
    // Mobx < 6 has different signature of function and doesn't provide its version in runtime explicitly.
    toJS({}, {detectCycles: true});
    return (value: any, detectCycles?: boolean) => {
      return toJS(value, {detectCycles});
    };
  } catch (e) {
    // Mobx >= 6
    return (value: any) => {
      return toJS(value);
    };
  }
})();
