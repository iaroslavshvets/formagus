import React from 'react';
import {injectFormApi} from '../../../src/injectFormApi';
import type {FormAPI} from '../../../src/FormController';

@(injectFormApi as any)
export class FieldValueDisplayWithInject extends React.Component<{
  formApi?: FormAPI;
  dataHook: string;
  displayedFieldName: string;
}> {
  render() {
    return <div data-hook={this.props.dataHook}>{this.props.formApi!.values[this.props.displayedFieldName]}</div>;
  }
}
