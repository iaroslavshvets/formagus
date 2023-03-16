import React from 'react';
import {injectFormApi, type FormAPI} from '../../../src';
import {observer} from 'mobx-react';

@injectFormApi
@observer
export class FieldValueDisplayWithInject extends React.Component<{
  formApi?: FormAPI;
  dataHook: string;
  displayedFieldName: string;
}> {
  render() {
    return <div data-hook={this.props.dataHook}>{this.props.formApi!.values[this.props.displayedFieldName]}</div>;
  }
}
