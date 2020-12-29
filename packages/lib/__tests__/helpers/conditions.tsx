import React from 'react';
import {eventually} from './eventually';

export const waitFor = (wrapper: Element) => async (checkFunction: () => boolean) => {
  return eventually(() => {
    if (!checkFunction()) {
      throw new Error();
    } else {
      return true;
    }
  });
};
