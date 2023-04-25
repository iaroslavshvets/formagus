import {toJS} from 'mobx';
import {isMobx6Used} from './isMobx6Used';

export const toJSCompat = (() => {
  const isMobx6 = isMobx6Used();

  return <T>(value: T, detectCycles?: boolean): T => {
    return isMobx6 ? toJS(value, detectCycles) : toJS(value, {detectCycles});
  };
})();
