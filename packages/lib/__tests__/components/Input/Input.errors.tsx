import React from 'react';
import {isEmpty} from 'lodash';
import {observer} from 'mobx-react';

export const InputErrors = observer((props: {errors: any}) => {
  const {errors} = props;
  return !isEmpty(errors) ? (
    <span data-hook="errors">
      {errors.map((error: string) => (
        <span key={error} data-hook={`error:${error}`}>
          {error}
        </span>
      ))}
    </span>
  ) : null;
});

(InputErrors as any).displayName = 'InputErrors';
