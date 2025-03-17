import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FormControllerContext} from './FormControllerContext';
import {createFormController} from '../createFormController/createFormController';
import {type FormProps} from './Form.types';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';
import {isEmpty} from '../utils/isEmpty';

export const Form = observer((props: FormProps) => {
  const {children, controller, ...restProps} = props;
  const [controllerInstance] = useState(() => {
    // controller can be injected by prop and created in any place,
    if (controller) {
      if (!isEmpty(restProps)) {
        throw new Error(
          `Form should have either "controller" prop with configured FormController instance or no ` +
            `"controller" prop and configuration passed as props, but not both`,
        );
      }

      return controller;
    }
    // or be created on the flight with passed configuration through props
    return createFormController(restProps);
  });

  // creates the provider and sets the controller, which will control all the form state
  return (
    <FormControllerContext.Provider value={controllerInstance as FormControllerClass}>
      {children(controllerInstance.API)}
    </FormControllerContext.Provider>
  );
});

Form.displayName = 'FormagusForm';
