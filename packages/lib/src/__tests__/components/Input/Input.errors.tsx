import React from 'react';
import {isEmpty} from 'lodash';
import {observer} from 'mobx-react-lite';

export const InputErrors = observer((props: {errors: string[]}) => {
  const errors = props.errors;
  return !isEmpty(errors) ? (
    <span data-hook="errors">
      {errors.map((error) => (
        <span key={error} data-hook={`error:${error}`}>
          {error}
        </span>
      ))}
    </span>
  ) : null;
});

InputErrors.displayName = 'InputErrors';
