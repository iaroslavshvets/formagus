import {InnerEventEmitter} from './createEventEmitter.types';

export const createEventEmitter = () => {
  const API: InnerEventEmitter = {
    listeners: {} as InnerEventEmitter['listeners'],
    on: (eventType, callback) => {
      if (!API.listeners[eventType]) {
        API.listeners[eventType] = [];
      }
      API.listeners[eventType].push(callback);

      return () => {
        if (API.listeners[eventType]) {
          API.listeners[eventType] = API.listeners[eventType].filter(
            (listener) => listener !== callback,
          );
        }
      }
    },
    off: (eventType) => {
      delete API.listeners[eventType];
    },
    trigger: (event) => {
      const {type, ...params} = event;
      if (API.listeners[type]) {
        API.listeners[type].forEach((callback) => {
          callback(params);
        });
      }
    },
  };

  return API;
};
