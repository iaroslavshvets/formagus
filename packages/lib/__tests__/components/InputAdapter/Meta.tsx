import React from 'react';
import {isEmpty, isObject} from 'lodash';
import {observer} from 'mobx-react';
import type {FieldMeta} from '../../../src/Field';

export const Meta = observer((props: {meta: FieldMeta}) => {
  const renderMetaProperty = (meta: any, currentKey: string = ''): any => {
    return Object.keys(meta).map((key) => {
      if (!isObject(meta[key])) {
        return (
          <span key={key} data-hook={`meta_${currentKey ? currentKey + ':' : ''}${key}`}>
            {String(meta[key])}
          </span>
        );
      } else if (!isEmpty(meta)) {
        return renderMetaProperty(meta[key], key);
      } else {
        return null;
      }
    });
  };

  const metaFields = renderMetaProperty(props.meta);

  return <div data-hook="meta-props">{metaFields}</div>;
});
