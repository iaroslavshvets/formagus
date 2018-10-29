import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {FormAPI, FormController} from '../FormController';

export interface FormPartOwnProps {
  children: (renderProps: FormAPI) => JSX.Element;
}

export interface FormPartInjectedProps {
  controller?: FormController;
}

export interface FormPartProps extends FormPartOwnProps, FormPartInjectedProps {}

@inject('controller')
@observer
export class FormPart extends React.Component<FormPartProps> {
  render() {
    return this.props.children(this.props.controller!.API);
  }
}
