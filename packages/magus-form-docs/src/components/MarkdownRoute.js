import {PAGE_BACKGROUND} from '../theme';
import React from 'react';
import {MarkdownPage} from './MarkdownPage';

export const MarkdownRoute = ({ dir, filename }) => (
  <div
    css={{
      background: PAGE_BACKGROUND,
      padding: 40,
      maxWidth: 800,
      lineHeight: 1.3,
      " .markdown > hr": {
        margin: "4em 0",
        border: 0,
        height: 1,
        background: "#ccc"
      },
      " .markdown > h2": {
        marginTop: "2em"
      },
      " .markdown > h3": {
        opacity: 0.75,
        marginTop: "2em"
      },
      " .markdown > p.category": {
        marginTop: "-1.5em",
        fontWeight: "bold",
        opacity: "0.5",
        fontStyle: "italic"
      }
    }}
  >
    <MarkdownPage
      dir={dir}
      filename={filename}
      css={{ padding: 40, maxWidth: 800 }}
    />
  </div>
);
