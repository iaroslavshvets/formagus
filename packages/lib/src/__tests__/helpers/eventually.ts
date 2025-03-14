import trier from 'trier-promise';

export type EventuallyOptions = {
  timeout: number;
  interval: number;
};

const defaults: EventuallyOptions = {
  timeout: 4500,
  interval: 50,
};

export type ConditionCheckFunction = (...args: any[]) => any;

export const eventually = (conditionCheckFunction: ConditionCheckFunction, opts?: EventuallyOptions) => {
  return Promise.resolve().then(() => {
    let error: unknown;

    const action = () =>
      Promise.resolve()
        .then(conditionCheckFunction)
        .catch((err: unknown) => {
          error = err;
          throw err;
        });

    const options = {action, ...defaults, ...opts};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return trier(options).catch(() => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        (error as Error).message = `Timeout of ${options.timeout} ms with: ${(error as Error).message}`;
      }

      throw error;
    });
  });
};
