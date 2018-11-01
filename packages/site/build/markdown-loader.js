const markdownIt = require("markdown-it");
const Prism = require("prismjs");
const cheerio = require("cheerio");
const markdownItMermaid = require('markdown-it-mermaid').default;

const aliases = {
  html: "markup",
  sh: "bash"
};

const highlight = (str, lang) => {
  if (!lang) {
    return str;
  } else {
    lang = aliases[lang] || lang;
    require(`prismjs/components/prism-${lang}.js`);
    if (Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang]);
    } else {
      return str;
    }
  }
};

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight
});

md.use(markdownItMermaid);

const defaultLinkRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const [,href] = token.attrs[0];

  if ((tokens[idx + 2].type !== 'link_close') || (tokens[idx + 1].type !== 'text')) {
    return;
  }

  if (href.startsWith('/')) {
    token.attrPush([ 'data-relative-link', 'true' ]);
  }
  return defaultLinkRender(tokens, idx, options, env, self);
};

const getTitle = (html) =>
  cheerio
    .load(html)("h1")
    .text();

module.exports = (markdown) => {
  const html = md.render(markdown);
  const title = JSON.stringify(getTitle(html));

  return `
    import React from 'react';
    import {Link, navigate} from '@reach/router';
    
    export const title = ${title};
        
    export class Markdown extends React.Component {
      constructor(props) {
        super(props);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.root = React.createRef();
      }
      
      onLinkClick(e) {
        if (e.target.matches('[data-relative-link]')) {
          e.preventDefault();
          navigate(e.target.getAttribute('href'));
        }
      }
      
      componentDidMount() {
        this.root.current.addEventListener('click', this.onLinkClick, true);
      }
      
      componentWillUnmount() {
        this.root.current.removeEventListener('click', this.onLinkClick, true);
      }
      
      render() {
        return React.createElement(
          'div',
          {
            ref: this.root,
            className: 'markdown',
            dangerouslySetInnerHTML: { __html: ${JSON.stringify(html)}}
          }
        )
      }
    }
  `;
};
