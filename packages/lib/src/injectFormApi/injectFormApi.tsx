import React, {useEffect, useState} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {observer} from 'mobx-react';
import {useFormController} from '../Form/useFormController';

function ComponentWithInjectedFormApi(WrappedComponent: any) {
  const InjectFormApiWrapper = observer((props: any) => {
    const controller = useFormController();
    const [, forceUpdate] = useState<unknown>();

    useEffect(() => {
      forceUpdate({});
    }, [JSON.stringify(controller!.API)]);

    return <WrappedComponent {...props} formApi={controller!.API} />;
  });

  (InjectFormApiWrapper as any).displayName = 'FormagusInjectFormApiWrapper';

  hoistNonReactStatics(InjectFormApiWrapper, WrappedComponent);

  return InjectFormApiWrapper;
}

/** @deprecated */
export const injectFormApi: any = <C extends React.ComponentClass>(Component: C) =>
  ComponentWithInjectedFormApi(Component);
