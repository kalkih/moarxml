import './components/uploadBox';
import './components/outputArea';
import './components/baseToast';
import builder from 'xmlbuilder';
import parse from './utils/parser';

const outputEl = document.querySelector('output-area');
const main = document.querySelector('main');

document.addEventListener('upload-new', (event) => {
  const parsed = parse(event.detail.content);
  if (parsed) {
    main.classList.add('init');
    outputEl.style.display = 'block';
    const xml = builder.create(parsed).end({ pretty: true });
    outputEl.text = xml;
  } else {
    outputEl.text = '';
    document.dispatchEvent(new CustomEvent('toast', {
      detail: { content: 'Couldn\'t parse file' },
    }));
  }
});

document.addEventListener('toast', (event) => {
  const { content } = event.detail;
  const node = document.createElement('base-toast');
  node.setAttribute('text', content);
  node.addEventListener('click', () => document.body.removeChild(node));
  document.body.appendChild(node);

  setTimeout(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
  }, 2500);
});
