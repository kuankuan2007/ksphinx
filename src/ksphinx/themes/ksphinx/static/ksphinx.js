const mediaMatch = window.matchMedia('(prefers-color-scheme: light)');
let theme = mediaMatch.matches ? 'light' : 'dark';
const widthMediaMatch = window.matchMedia('(max-width: 50em)');
let menuFold = widthMediaMatch.matches;
function refreshTheme() {
  document.body.dataset.theme = theme;
}
function refreshMenu() {
  document.body.dataset.menuFold = menuFold;
}
function initKsphinx() {
  refreshTheme();
  refreshMenu();
}
widthMediaMatch.addEventListener('change', () => {
  menuFold = widthMediaMatch.matches;
  refreshMenu();
});

mediaMatch.addEventListener('change', () => {
  theme = mediaMatch.matches ? 'light' : 'dark';
  refreshTheme();
});
function createCopyButton(ele) {
  const button = document.createElement('button');
  button.type = 'button';
  let timeOut;
  button.addEventListener('click', () => {
    copyText(ele.innerText);
    timeOut && clearTimeout(timeOut);
    button.innerText = 'Copied';
    setTimeout(() => {
      button.innerText = 'Copy';
    }, 1000);
  });
  button.classList.add('code-copy-button');
  button.innerText = 'Copy';
  return button;
}
const copyText =
  typeof navigator.clipboard !== 'undefined'
    ? async (text) => {
        await navigator.clipboard.writeText(text);
      }
    : () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      };
window.addEventListener('load', () => {
  initKsphinx();
  document.querySelectorAll('.highlight pre').forEach((ele) => {
    const codeEle = document.createElement('code');
    codeEle.innerHTML = ele.innerHTML;
    ele.innerHTML = '';
    ele.appendChild(codeEle);
  });
  hljs.highlightAll();
  themeButton = document.getElementById('theme-button');
  menuFoldButton = document.getElementById('menu-fold-button');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      refreshTheme();
    });
  }
  if (menuFoldButton) {
    menuFoldButton.addEventListener('click', () => {
      menuFold = !menuFold;
      refreshMenu();
    });
  }
  document.querySelectorAll('pre>code').forEach((ele) => {
    const parent = ele.parentElement;
    parent && parent.appendChild(createCopyButton(ele));
  });
});
