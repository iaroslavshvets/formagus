import * as React from "react";
import Component from "@reactions/component";

export const DocumentTitle = ({ title }) => (
  <Component
    title={title}
    didMount={() => (document.title = title)}
    didUpdate={({ prevProps }) => {
      if (prevProps.title !== title) {
        document.title = title;
      }
    }}
  />
);
