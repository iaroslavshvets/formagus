import React from 'react';
import {isEmpty, isObject} from 'lodash';
import {observer} from 'mobx-react';
import type {FieldMeta} from '../../../src';

export const InputMeta = observer((props: {meta: FieldMeta}) => {
  const renderMetaProperty = (meta: any, currentKey = ''): any => {
    return Object.keys(meta).map((key) => {
      if (!isObject(meta[key])) {
        return (
          <span key={key} data-hook={`meta_${currentKey ? `${currentKey}:` : ''}${key}`}>
            {String(meta[key])}
          </span>
        );
      }
      if (!isEmpty(meta)) {
        return renderMetaProperty(meta[key], key);
      }
      return null;
    });
  };

  const metaFields = renderMetaProperty(props.meta);

  return <div data-hook="meta-props">{metaFields}</div>;
});

(InputMeta as any).displayName = 'InputMeta';
