import * as mobx from 'mobx';

export const isMobx6 = () => {
  return 'makeObservable' in mobx;
};
