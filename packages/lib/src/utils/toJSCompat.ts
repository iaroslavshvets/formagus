import {toJS} from 'mobx';
import {isMobx6} from './isMobx6';

export const toJSCompat = (() => {
  return <T>(value: T, detectCycles?: boolean): T => {
    return isMobx6() ? toJS(value, detectCycles) : toJS(value, {detectCycles});
  }
})();
