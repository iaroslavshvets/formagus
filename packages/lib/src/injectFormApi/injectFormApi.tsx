import React, {useEffect, useState} from 'react';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import {observer} from 'mobx-react';
import {useFormControllerClass} from '../Form/useFormControllerClass';

/** @deprecated */
export const injectFormApi: any = <C extends React.ComponentClass>(WrappedComponent: C) => {
  const InjectFormApiWrapper = observer((props: any) => {
    const controller = useFormControllerClass(props);
    const [, forceUpdate] = useState<unknown>();

    useEffect(() => {
      forceUpdate({});
    }, [
      JSON.stringify({
        values: controller.API.values,
        errors: controller.API.errors,
        ...controller.API.meta,
      }),
    ]);

    return <WrappedComponent {...props} formApi={controller.API} />;
  });

  (InjectFormApiWrapper as any).displayName = 'FormagusInjectFormApiWrapper';

  hoistNonReactStatics.default(InjectFormApiWrapper, WrappedComponent);

  return InjectFormApiWrapper;
};
