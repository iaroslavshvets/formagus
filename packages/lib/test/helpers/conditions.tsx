import * as React from 'react';
import * as enzyme from 'enzyme';
import {eventually} from './eventually';

export const waitFor = (wrapper: enzyme.ReactWrapper<React.Component>) => async (checkFunction: () => boolean) => {
  return eventually(() => {
    wrapper.update();

    if (!checkFunction()) {
      throw new Error();
    } else {
      return true;
    }
  });
};
