import React from 'react';
import {BLACK, PAGE_BACKGROUND, SIDEBAR_SIZE, SMALL_BREAK, TOPBAR_SIZE} from '../theme';
import {Nav} from './Nav';
import GithubCorner from 'react-github-corner';

export class App extends React.Component {
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
    const {children} = this.props;

    return (
      <div>
        <GithubCorner href="https://github.com/iaroslavshvets/formagus" bannerColor={BLACK} />
        <Nav />
        <div
          css={{
            background: PAGE_BACKGROUND,
            minHeight: '100vw',
            marginLeft: SIDEBAR_SIZE,
            [SMALL_BREAK]: {
              marginLeft: 0,
              marginTop: TOPBAR_SIZE,
            },
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
