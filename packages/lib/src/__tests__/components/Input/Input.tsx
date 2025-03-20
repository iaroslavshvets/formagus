import React, {useEffect} from 'react';
import {isNil} from 'lodash';
import {type ChangeEvent} from 'react';
import {observer} from 'mobx-react-lite';
import {InputState} from './Input.state';
import {InputErrors} from './Input.errors';
import {type FieldRenderProps} from '../../../index';
import {useField, useForm} from '../../../index';

export type InputAdapterProps = {
  useRenderCounter?: boolean;
  useHook?: boolean;
} & Partial<FieldRenderProps>;

export const Input = observer((props: InputAdapterProps) => {
  const field = useField();
  const {useHook = true, useRenderCounter} = props;
  const {fieldProps, onFocus, onBlur, validate, validateField, name, onChange, value, errors, fieldState} = useHook
    ? field
    : props.field!;
  const normalizedValue = isNil(value) ? '' : value;
  const formState = useForm().formState;

  useEffect(() => {
    if (useRenderCounter) {
      window.$_TEST_RENDER_COUNT_$![name] = (window.$_TEST_RENDER_COUNT_$?.[name] ?? 0) + 1 || 1;
    }
  });

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

      <InputErrors errors={errors} />

      <InputState fieldState={fieldState} formState={formState} />

      <span
        data-hook="validate-field"
        onClick={() => {
          if (fieldProps.onValidate) {
            void validateField();
          } else {
            void validate();
          }
        }}
      />
      <span
        data-hook="validate"
        onClick={() => {
          void validate();
        }}
      />
    </div>
  );
});
