import React, { Fragment } from "react";
import { AsyncModule } from "./AsyncModule";
import { DocumentTitle } from "./DocumentTitle";

export const MarkdownPage = ({ dir, filename, css }) => (
  <AsyncModule
    key={dir + filename}
    load={() => {
      return import(`../markdown/${dir}/${filename}.md`);
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
