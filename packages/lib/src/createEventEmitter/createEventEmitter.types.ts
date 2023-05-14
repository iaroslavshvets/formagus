import type {Errors, SubmitParams} from '../FormControllerClass/FormControllerClass.types';

export type FormagusEvent =
  | {
      type: 'submit:begin';
    }
  | ({
      type: 'submit:end';
    } & Omit<SubmitParams, 'event'>)
  | {
      type: 'validate:begin';
    }
  | {
      type: 'validate:end';
      errors: Errors;
    }
  | {
      type: 'validateField:begin';
      name: string;
    }
  | {
      type: 'validateField:end';
      name: string;
      errors: Errors;
    };

export type InnerEventEmitter = {
  listeners: Record<FormagusEvent['type'], Function[]>;
  trigger: <T extends FormagusEvent>(event: T) => void;
  off: (eventType?: FormagusEvent['type'], callback?: Function) => void;
  on: <T extends FormagusEvent['type']>(
    eventType: T,
    callback: (
      params: Omit<
        FormagusEvent & {
          type: T;
        },
        'type'
      >,
    ) => any,
  ) => Function;
};

export type EventEmitter = Omit<InnerEventEmitter, 'trigger' | 'listeners'>;
