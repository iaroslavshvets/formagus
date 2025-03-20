/* eslint-disable
 @typescript-eslint/no-unsafe-member-access
 */

import React from 'react';
import {isEmpty, isObject} from 'lodash';
import {observer} from 'mobx-react-lite';
import {type FieldState} from '../../../Field/Field.types';
import {type FormState} from '../../../FormControllerClass/FormControllerClass.types';

export const InputState = observer((props: {fieldState: FieldState; formState: FormState}) => {
  const renderStateProperty = (state: any, currentKey: string, isFormState: boolean): any => {
    if (isEmpty(state)) {
      return null;
    }

    return Object.keys(state)
      .toSorted()
      .map((key) => {
        if (!isObject(state[key])) {
          return (
            <span
              key={key}
              data-hook={`${isFormState ? 'form_' : 'field_'}state_${currentKey ? `${currentKey}:` : ''}${key}`}
            >
              {}
              {String(state[key])}
            </span>
          );
        }
        if (!isEmpty(state)) {
          return renderStateProperty(state[key], key, isFormState);
        }
        return null;
      });
  };

  const stateFields = renderStateProperty(props.fieldState, '', false);

  const formState = renderStateProperty(props.formState, '', true);

  return (
    <div data-hook="state-props">
      {stateFields}
      {formState}
    </div>
  );
});

InputState.displayName = 'InputState';
