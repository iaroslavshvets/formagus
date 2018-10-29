import {ReactWrapper} from 'enzyme';
import * as eventually from 'wix-eventually';

export const waitFor = (wrapper: ReactWrapper) => async (checkFunction: () => boolean) => {
  return eventually(() => {
    wrapper.update();

    if (!checkFunction()) {
      throw new Error();
    } else {
      return true;
    }
  });
};
