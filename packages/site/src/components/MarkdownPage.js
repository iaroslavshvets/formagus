import React from 'react';
import {AsyncModule} from './AsyncModule';
import {DocumentTitle} from './DocumentTitle';
import * as mermaid from 'mermaid';

export const MarkdownPage = ({dir, filename, css, changeTitle = true}) => (
  <AsyncModule
    key={dir + filename}
    load={() => {
      const module = import(`../markdown/${dir}/${filename}.md`);
      setTimeout(mermaid.init);
      return module;
    }}
  >
    {(mod) =>
      mod ? (
        <>
          {changeTitle && <DocumentTitle title={`Formagus - ${mod.title}`} />}
          <mod.Markdown />
        </>
      ) : (
        <div
          css={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <div className="overlay-loader">
            <div className="loader">
              {Array.from(Array(7)).map((el, i) => {
                return <div key={i}/>
              })}
            </div>
          </div>
        </div>
      )
    }
  </AsyncModule>
);
