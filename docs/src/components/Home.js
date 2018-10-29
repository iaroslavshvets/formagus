import React, {Fragment} from 'react';
import {DocumentTitle} from './DocumentTitle';
import {MarkdownRoute} from './MarkdownRoute';

export const Home = () => (
  <Fragment>
    <DocumentTitle title="Reach Router - Next Generation Routing for React" />
    <div css={{ padding: 0, paddingBottom: 80 }}>
      <MarkdownRoute dir="pages" filename="intro" />
    </div>
  </Fragment>
);
