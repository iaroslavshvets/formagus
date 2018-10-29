import * as React from 'react';
import {GREEN} from '../theme';
import {MarkdownPage} from './MarkdownPage';
import {Link} from '@reach/router';

const tutorialLinks = [
  '01-intro',
  '10-next-steps'
];

const tutorialSandboxen = [
  'rwo3jz5vno',
  'n01l63w4nl'
];

export const Tutorial = ({ id, location }) => (
  <div
    css={{
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}
  >
    <div css={{ order: 1, flex: 1, overflow: "auto" }}>
      <div css={{ textAlign: "center", padding: 5 }}>
        <Link
          css={{
            fontSize: "80%",
            opacity: 0.5,
            color: "inherit",
            textDecoration: "none",
            display: "inline-block"
          }}
          to={location.search === "?fullpage" ? "." : "?fullpage"}
          replace
        >
          {location.search === "?fullpage" ? "Show" : "Hide"} Sandbox
        </Link>
      </div>
      <div
        css={{
          overflow: "auto"
        }}
      >
        <div
          css={{
            lineHeight: 1.3,
            padding: "10px 20px 80px 20px",
            " .markdown": { display: "block" },
            " .markdown > h1": {
              marginTop: 0,
              marginBottom: 0,
              fontSize: "100%"
            },
            " .markdown > *:not(pre):not(h1):not(h2)": {
              display: "block",
              clear: "both",
              float: "left",
              width: "400px",
              paddingRight: "40px"
            },
            " .markdown > pre": {
              float: "left",
              clear: "right",
              whiteSpace: "pre-wrap"
            }
          }}
        >
          <MarkdownPage dir="tutorial" filename={id} css={{}} />
        </div>
        <div css={{ clear: "both" }} />
        {(() => {
          const nextPage = tutorialLinks[tutorialLinks.indexOf(id) + 1];
          return nextPage ? (
            <Link
              to={`../${nextPage}`}
              css={{
                clear: "both",
                display: "inline-block",
                padding: "10px 20px",
                margin: "10px 20px",
                background: GREEN,
                textDecoration: "none",
                color: "white",
                ":active": {
                  position: "relative",
                  top: "1px",
                  left: "1px"
                }
              }}
            >
              Next →
            </Link>
          ) : null;
        })()}
        <div css={{ height: 40 }} />
      </div>
    </div>
    <iframe
      title="Codesandbox"
      src={`https://codesandbox.io/embed/${
        tutorialSandboxen[tutorialLinks.indexOf(id)]
        }?fontsize=13`}
      css={{
        display: location.search === "?fullpage" ? "none" : "block",
        width: "100%",
        border: 0,
        height: "60%"
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  </div>
);
