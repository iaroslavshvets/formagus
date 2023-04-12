import React from 'react';

export const Recipe = ({sandboxId}) => (
  <>
    <iframe
      id="recipe"
      title="formagus recipe"
      src={`https://codesandbox.io/embed/${sandboxId}?fontsize=13&module=/src/ExampleForm.tsx&view=split`}
      style={{
        display: 'block',
        width: '100%',
        border: 0,
        height: '100vh',
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  </>
);
