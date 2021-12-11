import React from 'react';
import {isNil} from 'lodash';
import type {ChangeEvent} from 'react';
import {observer} from 'mobx-react-lite';
import {FieldProps, useField} from '../../src';
import {Errors} from './InputAdapter/Errors';
import {Meta} from './InputAdapter/Meta';

export interface CustomFieldProps extends Omit<FieldProps, 'adapterProps' | 'adapter'> {
  callback?: Function;
  customState?: {
    [key: string]: string;
  };
}

export const InputField = observer((props: CustomFieldProps) => {
  const {onFocus, onBlur, validate, name, onChange, setCustomState, value, meta} = useField(props);

  const {errors} = meta;
  const normalizedValue = isNil(value) ? '' : value;

  const setCustomStateFromProps = () => {
    if (props.customState) {
      const key = Object.keys(props.customState)[0];
      const customValue = props.customState[key];
      setCustomState(key, customValue);
    }
  };

  return (
    <div data-hook={name}>
      <input
        data-hook={`input-${name}`}
        name={name}
        value={normalizedValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <Errors errors={errors} />

      <Meta meta={meta} />

      <span data-hook="set-custom-state" onClick={setCustomStateFromProps} />
      <span
        data-hook="callback"
        onClick={() => {
          if (props.callback) {
            props.callback();
          }
        }}
      />
      <span data-hook="validate" onClick={validate} />
    </div>
  );
});

InputField.displayName = 'InputField';
