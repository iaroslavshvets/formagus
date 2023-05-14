import {InnerEventEmitter} from './createEventEmitter.types';
import { isEmpty } from "../utils/isEmpty";

export const createEventEmitter = () => {
  const emitter: InnerEventEmitter = {
    listeners: {} as InnerEventEmitter['listeners'],
    on: (eventType, callback) => {
      if (isEmpty(emitter.listeners[eventType])) {
        emitter.listeners[eventType] = [];
      }
      emitter.listeners[eventType].push(callback);

      return function unsubscribe() {
        emitter.off(eventType, callback);
      };
    },
    off: (eventType?, callback?: Function) => {
      if (eventType === undefined) {
        emitter.listeners = {} as InnerEventEmitter['listeners'];
        return;
      }
      if (!isEmpty(emitter.listeners[eventType])) {
        if (callback) {
          emitter.listeners[eventType] = emitter.listeners[eventType].filter((listener) => listener !== callback);
        } else {
          delete emitter.listeners[eventType];
        }
      }
    },
    trigger: (event) => {
      const {type, ...params} = event;
      if (!isEmpty(emitter.listeners[type])) {
        emitter.listeners[type].forEach((listener) => {
          listener(params);
        });
      }
    },
  };

  return emitter;
};
