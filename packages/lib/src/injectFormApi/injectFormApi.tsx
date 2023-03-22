import React, {useEffect, useState} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {useFormController} from '../Form';
import {observer} from 'mobx-react';

function ComponentWithInjectedFormApi(WrappedComponent: any) {
  const InjectFormApiWrapper = observer((props: any) => {
    const controller = useFormController();
    const [_, forceUpdate] = useState<{}>();

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
