const mediaMatch = window.matchMedia('(prefers-color-scheme: light)');
let theme = mediaMatch.matches ? 'light' : 'dark';
let widthMediaMatch = window.matchMedia('(max-width: 15cm)');
let menuFold = widthMediaMatch.matches;
let fullscreenMenu = false;
function refreshTheme() {
  document.documentElement.dataset.theme = theme;
}
function refreshMenu() {
  document.documentElement.dataset.menuFold = menuFold;
}
function refreshFullscreenMenu() {
  document.documentElement.dataset.fullscreenMenu = fullscreenMenu;
}
function initKsphinx() {
  refreshTheme();
  refreshMenu();
}
function onWidthMediaChange() {
  menuFold = widthMediaMatch.matches;
  fullscreenMenu = widthMediaMatch.matches;
  refreshMenu();
  refreshFullscreenMenu();
}
widthMediaMatch.addEventListener('change', onWidthMediaChange);
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
  typeof navigator.clipboard.writeText === 'function'
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
function refreshSidebarWidth() {
  const sidebar = document.querySelector('.sphinxsidebar');
  if (!sidebar) {
    return;
  }
  sidebar.style.setProperty('inset', 'unset');
  sidebarWidth = sidebar.offsetWidth;
  sidebar.style.setProperty('inset', '');
  widthMediaMatch = window.matchMedia(`(max-width: ${sidebarWidth * 2}px)`);
  widthMediaMatch.addEventListener('change', onWidthMediaChange);
  onWidthMediaChange();
}
window.addEventListener('load', () => {
  initKsphinx();
  refreshSidebarWidth();
  document.querySelectorAll('.highlight pre').forEach((ele) => {
    const codeEle = document.createElement('code');
    codeEle.innerHTML = ele.innerHTML;
    ele.innerHTML = '';
    ele.appendChild(codeEle);
  });
  hljs.highlightAll();
  themeButton = document.getElementById('theme-button');
  menuButton = {
    show: document.getElementById('menu-show-button'),
    hide: document.getElementById('menu-hide-button'),
  };
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      refreshTheme();
    });
  }
  if (menuButton.show) {
    menuButton.show.addEventListener('click', () => {
      menuFold = false;
      refreshMenu();
    });
  }
  if (menuButton.hide) {
    menuButton.hide.addEventListener('click', () => {
      menuFold = true;
      refreshMenu();
    });
  }
  document.querySelectorAll('pre > code').forEach((ele) => {
    const parent = ele.parentElement;
    parent && parent.appendChild(createCopyButton(ele));
  });
});
