import trier from 'trier-promise';

export interface EventuallyOptions {
  timeout: number;
  interval: number;
}

const defaults: EventuallyOptions = {
  timeout: 4500,
  interval: 50,
};

export type ConditionCheckFunction = (...args: any[]) => any | never;

export const eventually = (conditionCheckFunction: ConditionCheckFunction, opts?: EventuallyOptions) => {
  return Promise.resolve().then(() => {
    let error: Error | null = null;

    const action = () =>
      Promise.resolve()
        .then(conditionCheckFunction)
        .catch((err) => {
          error = err;
          throw err;
        });

    const options = {action, ...defaults, ...opts};

    return trier(options).catch(() => {
      if (error !== null) {
        error.message = `Timeout of ${options.timeout} ms with: ${error.message}`;
      }

      throw error;
    });
  });
};
