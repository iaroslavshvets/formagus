import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {useFormController} from '../Form';

function ComponentWithInjectedFormApi(WrappedComponent: any) {
  const InjectFormApiWrapper = (props: any) => {
    const controller = useFormController();
    return <WrappedComponent {...props} formApi={controller!.API} />;
  };
  (InjectFormApiWrapper as any).displayName = 'FormagusInjectFormApiWrapper';

  hoistNonReactStatics(InjectFormApiWrapper, WrappedComponent);

  return InjectFormApiWrapper;
}

/** @deprecated */
export const injectFormApi: any = <C extends React.ComponentClass>(Component: C) =>
  ComponentWithInjectedFormApi(Component);
