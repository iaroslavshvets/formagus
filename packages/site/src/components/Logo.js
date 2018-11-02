import React from 'react';
import {GREEN} from '../theme';
import Formagus from '../public/images/formagus.svg';

export const Logo = () => (
  <div css={{background: GREEN, padding: '0px 20px'}}>
    <svg
      width="100%"
      viewBox="0 0 831 111"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      css={{
        height: '60px',
      }}
    >
      <title>Formagus Logo</title>
      <text
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: 'white',
          fontFamily: `'Fredericka the Great', cursive`,
          fontSize: '140px',
        }}
        x="0"
        y="110"
        id="e1_texte"
      >
        Formagus
      </text>
    </svg>
    <span
      css={{
        width: '50px',
        position: 'relative',
        float: 'right',
        top: '-53px',
      }}
    >
      <Formagus />
    </span>
  </div>
);
