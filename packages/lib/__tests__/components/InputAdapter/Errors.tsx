import React from 'react';
import {isEmpty} from 'lodash';
import {observer} from 'mobx-react-lite';

export const Errors = observer((props: {errors: any}) => {
  const {errors} = props;
  return !isEmpty(errors) ? (
    <span data-hook="errors">
      {errors.map((error: string) => {
        return (
          <span key={error} data-hook={`error:${error}`}>
            {error}
          </span>
        );
      })}
    </span>
  ) : null;
});

Errors.displayName = 'Errors';
