import React from 'react';
import Magic from '../public/images/magic.svg';
import {getRandomColor} from '../utils/getRandomColor';

const commonCss = {
  position: 'absolute',
  width: '100px',
  height: '100px',
};

const customize = (top, right, opacity) => {
  return {
    top: `${top}px`,
    right: `${right}px`,
    transform: `scale(0.${Math.floor(Math.random() * 5) + 1})`,
    opacity: opacity,
    fill: getRandomColor(),
  };
};

export class MagicBackground extends React.Component {
  render() {
    return (
      <>
        <Magic
          css={{
            ...commonCss,
            ...customize(50, 0, 0.5),
          }}
        />
        <Magic
          css={{
            ...commonCss,
            ...customize(-20, 500, 0.2),
          }}
        />
        <Magic
          css={{
            ...commonCss,
            ...customize(20, 350, 0.5),
          }}
        />
        <Magic
          css={{
            ...commonCss,
            ...customize(0, 50, 0.4),
          }}
        />
        <Magic
          css={{
            ...commonCss,
            ...customize(30, 150, 0.7),
          }}
        />
      </>
    );
  }
}
