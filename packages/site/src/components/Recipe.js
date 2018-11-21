import React, {Fragment} from 'react';
import {DocumentTitle} from './DocumentTitle';

const exampleSandboxen = {
  basic: 'nk2pznjq0j',
  passingPropsToAdapter: '4z6y33wx30',
  passingPropsToAdapterAsChild: 'oq79541m7q',
  withExternalController: 'q3m27nr9v4',
  dependantFields: '0m67vl8rwn',
  validation: 'nwm3w561mj',
  validationWithWarning: 'qlklvomzzq',
  validationOnSubmit: 'qq4p3zp6n6',
  fieldValidation: '5z1lz205m4',
  formatter: 'qlp7nzz2q4',
  persistingFieldState: 'wyv2jj0138',
  nestedFields: '93p2o713w',
  dynamicArray: '1q19ro79o7',
};

export const Recipe = ({id}) => (
  <Fragment>
    <DocumentTitle title={`Formagus - Recipe - ${id}`} />
    <iframe
      title="example"
      src={`https://codesandbox.io/embed/${exampleSandboxen[id]}?fontsize=13&module=/src/ExampleForm.tsx&view=split`}
      css={{
        display: 'block',
        width: '100%',
        border: 0,
        height: '100vh',
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  </Fragment>
);
