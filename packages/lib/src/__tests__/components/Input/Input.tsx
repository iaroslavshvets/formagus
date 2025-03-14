import React, {useEffect} from 'react';
import {isNil} from 'lodash';
import {type ChangeEvent} from 'react';
import {observer} from 'mobx-react-lite';
import {InputMeta} from './Input.meta';
import {InputErrors} from './Input.errors';
import {type FieldRenderProps} from '../../../index';
import {useField, useForm} from '../../../index';

export type InputAdapterProps = {
  useRenderCounter?: boolean;
  useHook?: boolean;
} & Partial<FieldRenderProps>;

export const Input = observer((props: InputAdapterProps) => {
  const formagusHook = useField();
  const {useHook = true, useRenderCounter} = props;
  const {fieldProps, onFocus, onBlur, validate, validateField, name, onChange, value, errors, meta} = useHook
    ? formagusHook
    : props.formagus!;
  const normalizedValue = isNil(value) ? '' : value;
  const formMeta = useForm().meta;

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

      <InputMeta meta={meta} formMeta={formMeta} />

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
