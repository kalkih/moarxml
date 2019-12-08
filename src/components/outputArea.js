import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      position: relative;
      background: var(--color-bg-sec);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-sizing: border-box;
    }
    :host::before {
      display: block;
      content: 'XML';
      margin: 1em 1em 0;
      padding-bottom: .6em;
      font-weight: 600;
      border-bottom: 2px solid var(--color-bg);
    }
    pre {
      height: calc(100% - 3em);
      overflow: scroll;
      padding: .5em 1em 1em;
      line-height: 1.75em;
      margin: 0;
      font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
      font-weight: 500;
      box-sizing: border-box;
    }
    .copy {
      user-select: none;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      padding: 1.2em;
      font-weight: 600;
      font-size: .8em;
      display: none;
      animation: reveal .25s;
    }
    .copy:hover {
      color: var(--color-accent-sec);
      background: rgba(0,0,0,.1);
    }
    .hljs-meta {
      color: var(--color-accent-alt);
    }
    .hljs-tag,
    .hljs-name {
      color: var(--color-accent-sec);
    }
    @keyframes reveal {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
  <pre id="output" lang="xml"></pre>
  <span class="copy">Copy</span>
  <span class="alert"></span>
`;

class OutputArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._text = '';
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.copy').addEventListener('click', () => this._copy());
  }

  set text(value) {
    this._text = value;
    this._lines = value.split(/\r\n|\r|\n/).length;
    if (value) {
      this.shadowRoot.querySelector('.copy').style.display = 'block';
    } else {
      this.shadowRoot.querySelector('.copy').style.display = 'none';
    }
    this._updateText();
  }

  get text() {
    return this._text;
  }

  _copy() {
    this.shadowRoot.getSelection().selectAllChildren(
      this.shadowRoot.getElementById('output'),
    );
    document.execCommand('copy');
    this.shadowRoot.getSelection().removeAllRanges();
    this.dispatchEvent(new CustomEvent('toast', {
      bubbles: true,
      detail: { content: `Copied ${this._lines} lines!` },
    }));
  }

  _updateText(text = this.text) {
    const highlight = hljs.highlight('xml', text).value;
    this.shadowRoot.getElementById('output').innerHTML = highlight;
  }
}

customElements.define('output-area', OutputArea);
