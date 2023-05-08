import React from 'react';
import {isEmpty, isObject} from 'lodash';
import {observer} from 'mobx-react';
import type {FieldMeta} from '../../../src/Field/Field.types';
import {FormMeta} from '../../../src/FormControllerClass/FormControllerClass.types';

export const InputMeta = observer((props: {meta: FieldMeta; formMeta: FormMeta}) => {
  const renderMetaProperty = (meta: any, currentKey: string, isFormMeta: boolean): any => {
    return Object.keys(meta).map((key) => {
      if (!isObject(meta[key])) {
        return (
          <span
            key={key}
            data-hook={`${isFormMeta ? 'form_' : 'field_'}meta_${currentKey ? `${currentKey}:` : ''}${key}`}
          >
            {String(meta[key])}
          </span>
        );
      }
      if (!isEmpty(meta)) {
        return renderMetaProperty(meta[key], key, isFormMeta);
      }
      return null;
    });
  };

  const metaFields = renderMetaProperty(props.meta, '', false);
  const formMeta = renderMetaProperty(props.formMeta, '', true);

  return (
    <div data-hook="meta-props">
      {metaFields}
      {formMeta}
    </div>
  );
});

(InputMeta as any).displayName = 'InputMeta';
