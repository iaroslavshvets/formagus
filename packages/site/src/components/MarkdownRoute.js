import {PAGE_BACKGROUND} from '../theme';
import React from 'react';
import {MarkdownPage} from './MarkdownPage';
import {Types} from './Types';
import {Router} from '@reach/router';

export class MarkdownRoute extends React.Component {
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
