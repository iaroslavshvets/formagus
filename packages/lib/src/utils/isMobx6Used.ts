import * as mobx from 'mobx';

export const isMobx6Used = () => {
  return 'makeObservable' in mobx;
};
