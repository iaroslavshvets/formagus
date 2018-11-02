import React, {Fragment} from 'react';
import {DocumentTitle} from './DocumentTitle';

const exampleSandboxen = {
  basic: 'nk2pznjq0j',
  passingPropsToAdapter: '4z6y33wx30',
  passingPropsToAdapterAsChild: 'oq79541m7q',
  withExternalController: 'q3m27nr9v4',
  validation: 'nwm3w561mj',
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
