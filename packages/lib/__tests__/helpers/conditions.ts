import {eventually} from './eventually';

export const waitFor = async (checkFunction: () => boolean) =>
  eventually(() => {
    if (!checkFunction()) {
      throw new Error();
    } else {
      return true;
    }
  });
