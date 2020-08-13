import {Observer, Provider} from 'mobx-react';
import React, {useState, FC} from 'react';
import {FormController} from '../FormController';
import {FormPart} from '../FormPart';
import {FormControllerContext} from './FormControllerContext';
import type {FormProps} from './Form.types';

export const Form: FC<FormProps> = (props) => {
  const [controller] = useState(() => {
    if (props.controller && Object.keys(props).length > 2) {
      throw new Error(
        'Form should have either "controller" prop with configured Controller instance or no ' +
          '"controller" prop and configuration passed as props, but not both',
      );
    }
    //controller can be injected by prop and created in any place,
    //or be created on the flight with passed configuration through props
    return props.controller || new FormController(props);
  });

  //creates the provider and sets the controller, which will control all the form state
  return (
    <Observer>
      {() => (
        <Provider controller={controller}>
          <FormControllerContext.Provider value={controller}>
            <FormPart>{props.children}</FormPart>
          </FormControllerContext.Provider>
        </Provider>
      )}
    </Observer>
  );
};
