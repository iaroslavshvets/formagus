import React, {useEffect, useState} from 'react';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import {observer} from 'mobx-react';
import {useFormControllerClass} from '../Form/useFormControllerClass';

function ComponentWithInjectedFormApi(WrappedComponent: any) {
  const InjectFormApiWrapper = observer((props: any) => {
    const controller = useFormControllerClass();
    const [, forceUpdate] = useState<unknown>();

    useEffect(() => {
      forceUpdate({});
    }, [JSON.stringify(controller!.API)]);

    return <WrappedComponent {...props} formApi={controller!.API} />;
  });

  (InjectFormApiWrapper as any).displayName = 'FormagusInjectFormApiWrapper';

  hoistNonReactStatics.default(InjectFormApiWrapper, WrappedComponent);

  return InjectFormApiWrapper;
}

/** @deprecated */
export const injectFormApi: any = <C extends React.ComponentClass>(Component: C) =>
  ComponentWithInjectedFormApi(Component);
