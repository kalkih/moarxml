const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      align-items: center;
      display: flex;
      flex-flow: column;
      position: relative;
    }
    .upload-box {
      overflow: hidden;
      position: relative;
    }
    .upload-box [type=file] {
      cursor: inherit;
      display: block;
      font-size: 999px;
      filter: alpha(opacity=0);
      min-height: 100%;
      min-width: 100%;
      opacity: 0;
      position: absolute;
      right: 0;
      text-align: right;
      top: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .upload-box {
      background-size: 100% 100%;
      background: var(--color-accent-grad);
      border-radius: var(--border-radius);
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.50);
      float: left;
      font-weight: 600;
      line-height: 1.25em;
      min-height: calc(1em);
      padding: .8em 2.6em;
      text-align: center;
      background-size: 100% 100%;
      transition: background-size .15s;
    }
    .upload-box:hover {
      background-size: 400% 100%;
    }
    .upload-box [type=file] {
      cursor: pointer;
    }
    .upload-name {
      bottom: calc(-2em);
      font-size: .8em;
      line-height: 1.75em;
      max-width: 100%;
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  </style>
  <label class="upload-box">
    Select file...
    <input type="file" id="file-upload" name="upload">
  </label>
  <span class="upload-name" id="file-name"></span>
`;

class UploadBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.getElementById('file-upload').addEventListener('change', (e) => this._updated(e));
  }

  _updateFilename(name) {
    this.shadowRoot.getElementById('file-name').innerText = name;
  }

  async _updated(e) {
    const input = e.target;
    if ('files' in input && input.files.length > 0) {
      this._updateFilename(input.files[0].name);
      try {
        const content = await UploadBox.readFile(input.files[0]);
        this.dispatchEvent(new CustomEvent('upload-new', {
          bubbles: true,
          detail: { content },
        }));
      } catch (error) {
        this.dispatchEvent(new CustomEvent('toast', {
          bubbles: true,
          detail: { content: error.message },
        }));
      }
    } else {
      this._updateFilename('');
    }
  }

  static readFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
}

customElements.define('upload-box', UploadBox);
