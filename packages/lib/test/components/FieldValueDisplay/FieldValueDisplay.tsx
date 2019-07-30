import * as React from 'react';
import {FormAPI} from '../../../src/FormController/FormController';
import {injectFormApi} from '../../../src/injectFormApi';

export interface FieldValueDisplayProps {
  formApi?: FormAPI;
  dataHook?: string;
  displayedFieldName: string;
}

@injectFormApi
export class FieldValueDisplay extends React.Component<FieldValueDisplayProps> {
  render() {
    return <div data-hook={this.props.dataHook}>{this.props!.formApi!.values[this.props.displayedFieldName]}</div>;
  }
}
