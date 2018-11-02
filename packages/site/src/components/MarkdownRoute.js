import {PAGE_BACKGROUND} from '../theme';
import React from 'react';
import {MarkdownPage} from './MarkdownPage';
import {Types} from './Types';
import {Router} from '@reach/router';

export class MarkdownRoute extends React.Component {
  state = {
    redirectTo: null,
  };

  //TODO make actual redirect
  constructor(props) {
    super(props);

    const [, ...pathParts] = location.pathname.split('/');

    if (pathParts.length > 2) {
      this.state = {
        redirectTo: '/' + pathParts[0] + '/' + pathParts[1],
      };
    }
  }

  render() {
    const {dir, filename} = this.props;

    return (
      <div
        css={{
          background: PAGE_BACKGROUND,
          padding: '10px 40px',
          maxWidth: 800,
          lineHeight: 1.3,
        }}
      >
        <Router>
          <Types path="/types/:type" />
        </Router>
        <MarkdownPage dir={dir} filename={filename} css={{padding: 40, maxWidth: 800}} />
      </div>
    );
  }
}
