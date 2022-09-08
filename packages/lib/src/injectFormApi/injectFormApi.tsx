import React from 'react';
import {inject, observer} from 'mobx-react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type {FormController} from '../FormController';

function ComponentWithInjectedFormApi<C extends React.ComponentClass>(_Component: C): C {
  @inject('controller')
  @observer
  class InjectFormApiWrapper extends React.Component<{controller?: FormController}> {
    render() {
      const Component = _Component as any;
      const {controller, ...props} = this.props;
      return <Component {...(props as any)} formApi={controller!.API} />;
    }
  }
  (InjectFormApiWrapper as any).displayName = 'FormagusInjectFormApiWrapper';

  hoistNonReactStatics(InjectFormApiWrapper, _Component);

  return InjectFormApiWrapper as C;
}

/** @deprecated */
export const injectFormApi = <C extends React.ComponentClass>(Component: C) => ComponentWithInjectedFormApi(Component);
