import {Provider} from 'mobx-react';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FormController} from '../FormController';
import {FormPart} from '../FormPart';
import {FormControllerContext} from './FormControllerContext';
import type {FormProps} from './Form.types';

export const Form = observer((props: FormProps) => {
  const {children, ...restProps} = props;
  const [controller] = useState(() => {
    if (restProps.controller && Object.keys(restProps).length > 1) {
      throw new Error(
        'Form should have either "controller" prop with configured Controller instance or no ' +
          '"controller" prop and configuration passed as props, but not both',
      );
    }
    //controller can be injected by prop and created in any place,
    //or be created on the flight with passed configuration through props
    return props.controller || new FormController(restProps);
  });

  //creates the provider and sets the controller, which will control all the form state
  return (
    <Provider controller={controller}>
      <FormControllerContext.Provider value={controller}>
        <FormPart>{children}</FormPart>
      </FormControllerContext.Provider>
    </Provider>
  );
});

Form.displayName = 'FormagusForm';
