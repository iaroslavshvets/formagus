import * as mobx from 'mobx';

export const makeObservableForMobx6 = (instance: any) => {
  if ((mobx as any).makeObservable) {
    (mobx as any).makeObservable(instance);
  }
};
