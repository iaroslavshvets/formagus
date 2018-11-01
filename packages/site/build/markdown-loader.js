const markdownIt = require("markdown-it");
const Prism = require("prismjs");
const cheerio = require("cheerio");
const markdownItMermaid = require('markdown-it-mermaid').default;
const markdownItForInline = require('markdown-it-for-inline');

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

md
  .use(markdownItMermaid)
  .use(markdownItForInline, 'open_link_on_same_page', 'link_open', function (tokens, idx) {
    const token = tokens[idx];
    const [,href] = token.attrs[0];

    if ((tokens[idx + 2].type !== 'link_close') ||
      (tokens[idx + 1].type !== 'text')) {
      return;
    }

    if (href.startsWith('/')) {
      token.attrPush([ 'data-relative-link', 'true' ]);
    }
  });

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
    
    class Markdown extends React.Component {
      constructor(props) {
        super(props);
        console.log('OK');
        this.onLinkClick = this.onLinkClick.bind(this);
      }
      
      onLinkClick(e) {
        if (e.target.matches('[data-relative-link]')) {
          e.preventDefault();
          navigate(e.target.getAttribute('href'));
        }
      }
      
      componentDidMount() {
        document.addEventListener('click', this.onLinkClick, true);
      }
      
      componentWillUnmount() {
        document.removeEventListener('click', this.onLinkClick, true);
      }
      
      render() {
        return React.createElement(
          'div',
          {
            className: 'markdown',
            dangerouslySetInnerHTML: { __html: ${JSON.stringify(html)}}
          }
        )
      }
    }
    
    export const title = ${title};
    export default function() {
      return React.createElement(Markdown)
    }
  `;
};
