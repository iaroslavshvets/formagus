import * as React from 'react';
import {observer, Provider} from 'mobx-react';
import {FormController, FormControllerOptions} from '../FormController';
import {FormPart, FormPartProps} from '../FormPart';

export interface FormProps extends FormControllerOptions, FormPartProps {}

@observer
export class Form extends React.Component<FormProps> {
  controller: FormController;

  constructor(props: any) {
    super(props);

    //"children" will be another prop, so take it to the account as well
    if (props.controller && Object.keys(props).length > 2) {
      throw new Error(
        'Form should have either "controller" prop with configured Controller instance or no ' +
          '"controller" prop and configuration passed as props, but not both',
      );
    }
    //controller can be injected by prop and created in any place,
    //or be created on the flight with passed configuration through props
    this.controller = props.controller || new FormController(props);
  }

  //creates the provider and sets the controller, which will control all the form state
  render() {
    return (
      <Provider controller={this.controller}>
        <FormPart>{this.props.children}</FormPart>
      </Provider>
    );
  }
}
