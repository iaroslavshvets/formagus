import React, { Fragment } from "react";
import { DocumentTitle } from "./DocumentTitle";

const exampleSandboxen = {
  basic: "lyzwj8w0qz"
};

export const Example = ({ id }) =>   (
  <Fragment>
    <DocumentTitle title={`Formagus - Example - ${id}`} />
    <iframe
      title="example"
      src={`https://codesandbox.io/embed/${exampleSandboxen[id]}?fontsize=13`}
      css={{
        display: "block",
        width: "100%",
        border: 0,
        height: "100vh"
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  </Fragment>
);
