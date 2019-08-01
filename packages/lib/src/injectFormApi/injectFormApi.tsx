import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {FormController} from '../FormController/FormController';
import * as hoistNonReactStatics from 'hoist-non-react-statics';

interface InjectFormApiWrapperProps {
  controller?: FormController;
}

function ComponentWithInjectedFormApi<C extends React.ComponentClass>(Component: C): C {
  @inject('controller')
  @observer
  class InjectFormApiWrapper extends React.Component<InjectFormApiWrapperProps> {
    render() {
      const {controller, ...props} = this.props;
      return <Component {...props as any} formApi={controller!.API} />;
    }
  }

  hoistNonReactStatics(InjectFormApiWrapper, Component);

  return InjectFormApiWrapper as C;
}

export const injectFormApi = <C extends React.ComponentClass>(Component: C) => ComponentWithInjectedFormApi(Component);
