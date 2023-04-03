import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import {flattenValues} from '../utils/flattenValues';
import {unflattenValues} from '../utils/unflattenValues';

export const utils = {
  flattenValues,
  unflattenValues,
  getValue: get,
  setValue: set,
  unsetValue: unset,
};
