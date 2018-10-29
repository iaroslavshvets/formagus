import React from 'react';
import {PAGE_BACKGROUND, SIDEBAR_SIZE, SMALL_BREAK, TOPBAR_SIZE} from '../theme';
import {Nav} from './Nav';

export const App = ({ children }) => (
  <div>
    <Nav />
    <div
      css={{
        background: PAGE_BACKGROUND,
        minHeight: '100vw',
        marginLeft: SIDEBAR_SIZE,
        [SMALL_BREAK]: {
          marginLeft: 0,
          marginTop: TOPBAR_SIZE
        }
      }}
    >
      {children}
    </div>
  </div>
);
