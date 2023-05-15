import {Emitter} from 'mitt';
import type {Errors, SubmitParams} from '../FormControllerClass/FormControllerClass.types';

export type FormagusEvent = {
  'submit:begin': undefined;
  'submit:end': Omit<SubmitParams, 'event'>;
  'validate:begin': undefined;
  'validate:end': {errors: Errors};
  'validateField:begin': {name: string};
  'validateField:end': {name: string; errors: Errors};
};

export type EventEmitter = Emitter<FormagusEvent>;
