import React from 'react';
import {get} from 'lodash';
import {injectFormApi, type FormAPI} from '../../../src';

@injectFormApi
export class FieldValueDisplayWithInject extends React.Component<{
  formApi?: FormAPI;
  dataHook: string;
  displayedFieldName: string;
}> {
  render() {
    const {displayedFieldName, dataHook, formApi} = this.props;
    return <div data-hook={dataHook}>{get(formApi!.values, displayedFieldName)}</div>;
  }
}
