import {InnerEventEmitter} from './createEventEmitter.types';

export const createEventEmitter = () => {
  const emitter: InnerEventEmitter = {
    listeners: {} as InnerEventEmitter['listeners'],
    on: (eventType, callback) => {
      if (!emitter.listeners[eventType]) {
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
      if (emitter.listeners[eventType]) {
        if (callback && emitter.listeners[eventType].length > 1) {
          emitter.listeners[eventType] = emitter.listeners[eventType].filter((listener) => listener !== callback);
        } else {
          delete emitter.listeners[eventType];
        }
      }
    },
    trigger: (event) => {
      const {type, ...params} = event;
      if (emitter.listeners[type]) {
        emitter.listeners[type].forEach((listener) => {
          listener(params);
        });
      }
    },
  };

  return emitter;
};
