import * as React from 'react';
import {isEmpty, isObject} from 'lodash';
import {AdapterMetaInfo} from '../../../src/Field';
import {observer} from 'mobx-react';

export const Meta = observer((props: {meta: AdapterMetaInfo}) => {
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
