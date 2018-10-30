import React, { Fragment } from "react";
import { AsyncModule } from "./AsyncModule";
import { DocumentTitle } from "./DocumentTitle";
import * as mermaid from 'mermaid';

export const MarkdownPage = ({ dir, filename, css }) => (
  <AsyncModule
    key={dir + filename}
    load={() => {
      const module = import(`../markdown/${dir}/${filename}.md`);
      setTimeout(mermaid.init);
      return module;
    }}
  >
    {mod =>
      mod ? (
        <Fragment>
          <DocumentTitle title={`Formagus - ${mod.title}`} />
          <mod.default />
        </Fragment>
      ) : (
        <div>Loading...</div>
      )
    }
  </AsyncModule>
);
