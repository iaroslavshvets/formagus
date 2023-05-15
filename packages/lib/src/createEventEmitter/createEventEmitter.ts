import mitt from 'mitt';
import {EventEmitter, FormagusEvent} from './createEventEmitter.types';

export const createEventEmitter = (): EventEmitter => {
  return mitt<FormagusEvent>();
};
