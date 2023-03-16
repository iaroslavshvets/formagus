import React, { useEffect } from "react";
import {isNil} from 'lodash';
import {Meta} from './Meta';
import {Errors} from './Errors';
import type {ChangeEvent} from 'react';
import type {AdapterProps} from '../../../src';
import {observer} from 'mobx-react';

export interface InputAdapterProps extends AdapterProps {
  callback?: Function;
  useRenderCounter?: boolean;
  customState?: {
    [key: string]: string;
  };
}

export const InputAdapter = observer((props: InputAdapterProps) =>  {
  const {onFocus, onBlur, validate, name, onChange, value, meta} = props.formagus!;
  const {errors} = meta;
  const normalizedValue = isNil(value) ? '' : value;

  useEffect(() => {
    if (props.useRenderCounter) {
      window.$_TEST_RENDER_COUNT_$![name] = window.$_TEST_RENDER_COUNT_$![name] + 1 || 1;
    }
  });
  const setCustomState = () => {
    if (props.customState) {
      const key = Object.keys(props.customState)[0];
      const value = props.customState[key];
      props.formagus!.setCustomState(key, value);
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

      <span data-hook="set-custom-state" onClick={setCustomState} />
      <span data-hook="callback" onClick={() => {
        props.callback?.()}
      } />
      <span data-hook="validate" onClick={validate} />
    </div>
  );
});
