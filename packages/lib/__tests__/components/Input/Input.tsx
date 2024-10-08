import React, {useEffect} from 'react';
import {isNil} from 'lodash';
import {type ChangeEvent} from 'react';
import {observer} from 'mobx-react-lite';
import {InputMeta} from './Input.meta';
import {InputErrors} from './Input.errors';
import {type FieldRenderProps} from '../../../src';
import {useField, useForm} from '../../../src';

export interface InputAdapterProps extends Partial<FieldRenderProps> {
  useRenderCounter?: boolean;
  useHook?: boolean;
  customState?: Record<string, any>;
}

export const Input = observer((props: InputAdapterProps) => {
  const formagusHook = useField();
  const {useHook = true, useRenderCounter} = props;
  const {fieldProps, onFocus, onBlur, validate, validateField, name, setCustomState, onChange, value, errors, meta} =
    useHook ? formagusHook : props.formagus!;
  const normalizedValue = isNil(value) ? '' : value;
  const formMeta = useForm().meta;

  useEffect(() => {
    if (useRenderCounter) {
      window.$_TEST_RENDER_COUNT_$![name] = window.$_TEST_RENDER_COUNT_$![name] + 1 || 1;
    }
  });

  const onSetCustomState = () => {
    if (props.customState) {
      const key = Object.keys(props.customState)[0];
      const customState = props.customState[key];
      setCustomState(key, customState);
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

      <InputErrors errors={errors} />

      <InputMeta meta={meta} formMeta={formMeta} />

      <span data-hook="set-custom-state" onClick={onSetCustomState} />
      <span data-hook="validate-field" onClick={fieldProps.onValidate ? validateField : validate} />
      <span data-hook="validate" onClick={validate} />
    </div>
  );
});
