import React from 'react';
import {inject, observer} from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type {FormController} from '../FormController';

function ComponentWithInjectedFormApi<C extends React.ComponentClass>(Component: C): C {
  @inject('controller')
  @observer
  class InjectFormApiWrapper extends React.Component<{controller?: FormController}> {
    render() {
      const {controller, ...props} = this.props;
      return <Component {...(props as any)} formApi={controller!.API} />;
    }
  }

  hoistNonReactStatics(InjectFormApiWrapper, Component);

  return InjectFormApiWrapper as C;
}

/** @deprecated */
export const injectFormApi = <C extends React.ComponentClass>(Component: C) => ComponentWithInjectedFormApi(Component);
