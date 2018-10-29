import React from 'react';
import {Home} from './Home';
import {hot} from 'react-hot-loader';
import {Router} from '@reach/router';
import {Tutorial} from './Tutorial';
import {App} from './App';
import {BLACK} from '../theme';
import {MarkdownRoute} from './MarkdownRoute';
import {Example} from './Example';
require('../public/styles/app.scss');
require('../public/styles/markdown.scss');
require('../public/styles/prismjs.scss');

const RootView = () => (
  <div css={{ color: BLACK }}>
    <Router basepath={BASEPATH}>
      <App path="/">
        <Home path="/" />
        <Example path="example/:id" />
        <Tutorial path="tutorial/:id" />
        <MarkdownRoute dir="api" path="api/:filename" />
        <MarkdownRoute dir="pages" path=":filename" />
      </App>
    </Router>
  </div>
);

export const Root = hot(module)(RootView);
