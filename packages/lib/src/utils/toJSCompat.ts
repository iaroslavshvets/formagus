import {toJS} from 'mobx';
import {isMobx6} from './isMobx6';

export const toJSCompat = (() => {
  return isMobx6() ? toJS : (value: any, detectCycles?: boolean) => toJS(value, {detectCycles});
})();
