import {toJS} from 'mobx';
import {isMobx6Used} from './isMobx6Used';

export const toJSCompat = (() => {
  const isMobx6 = isMobx6Used();

  return <T = unknown>(value: T): T => {
    return isMobx6 ? toJS(value, false) : toJS(value, {detectCycles: false});
  };
})();
