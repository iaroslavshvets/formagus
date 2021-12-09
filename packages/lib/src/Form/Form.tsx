import {Provider} from 'mobx-react';
import {Observer} from 'mobx-react-lite';
import React, {useState, FC} from 'react';
import {FormController} from '../FormController';
import {FormPart} from '../FormPart';
import {FormControllerContext} from './FormControllerContext';
import type {FormProps} from './Form.types';

export const Form: FC<FormProps> = (props) => {
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
    <Observer>
      {() => (
        <Provider controller={controller}>
          <FormControllerContext.Provider value={controller}>
            <FormPart>{children}</FormPart>
          </FormControllerContext.Provider>
        </Provider>
      )}
    </Observer>
  );
};
