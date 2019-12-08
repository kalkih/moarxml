const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      position: fixed;
      display: flex;
      bottom: var(--space);
      color: var(--color-bg);
      font-weight: 600;
      width: 100%;
      justify-content: center;
      user-select: none;
    }
    div {
      padding: 1em 1.8em;
      background: var(--color-font);
      border-radius: 5em;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.50);
      animation: toast-reveal 2.5s forwards;
      text-align: center;
      cursor: pointer;
    }
    @keyframes toast-reveal {
      0% {
        transform: translateY(calc(var(--space) / 2));
        opacity: 0;
      }
      5% {
        transform: none;
        opacity: 1;
      }
      95% {
        transform: none;
        opacity: 1;
      }
      100% {
        transform: translateY(calc(var(--space) / 2));
        opacity: 0;
      }
    }
  </style>
  <div>
    <span id="text"></span>
  </div>
`;

class BaseToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['text'];
  }

  _updateText(text) {
    this.shadowRoot.getElementById('text').innerText = text;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._updateText(newValue);
  }
}

customElements.define('base-toast', BaseToast);
