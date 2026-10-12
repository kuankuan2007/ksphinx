import hljs from 'highlight.js';
const themeMediaMatch = window.matchMedia('(prefers-color-scheme: light)');
const reducedMotionMediaMatch = window.matchMedia('(prefers-reduced-motion: reduce)');

let theme = themeMediaMatch.matches ? 'light' : 'dark';
let widthMediaMatch = window.matchMedia('(max-width: 15cm)');
let menuFold = false;
let fullscreenMenu = false;
function refreshTheme() {
  document.documentElement.dataset.theme = theme;
}
function refreshMenu() {
  document.documentElement.dataset.menuFold = menuFold ? 'true' : 'false';
}
function refreshMotionReduced() {
  document.documentElement.dataset.motion = reducedMotionMediaMatch.matches
    ? 'reduce'
    : 'no-preference';
}
function refreshFullscreenMenu() {
  document.documentElement.dataset.fullscreenMenu = fullscreenMenu ? 'true' : 'false';
}
function initKsphinxMedia() {
  refreshTheme();
  refreshMenu();
  refreshMotionReduced();
}
window.initKsphinxMedia = initKsphinxMedia;
function onWidthMediaChange() {
  menuFold = widthMediaMatch.matches;
  fullscreenMenu = widthMediaMatch.matches;
  refreshMenu();
  refreshFullscreenMenu();
}
widthMediaMatch.addEventListener('change', onWidthMediaChange);
themeMediaMatch.addEventListener('change', () => {
  theme = themeMediaMatch.matches ? 'light' : 'dark';
  refreshTheme();
});
reducedMotionMediaMatch.addEventListener('change', () => {
  refreshMotionReduced();
});
function createCopyButton(ele: HTMLElement) {
  const button = document.createElement('button');
  button.type = 'button';
  let timeOut: number | null = null;
  button.addEventListener('click', () => {
    copyText(ele.innerText);
    timeOut && clearTimeout(timeOut);
    button.innerText = 'Copied';
    timeOut = setTimeout(() => {
      button.innerText = 'Copy';
    }, 1000);
  });
  button.classList.add('code-copy-button');
  button.innerText = 'Copy';
  return button;
}
const copyText =
  typeof navigator.clipboard.writeText === 'function'
    ? async (text: string) => {
        await navigator.clipboard.writeText(text);
      }
    : (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      };
function refreshSidebarWidth() {
  const sidebar = document.querySelector('.sphinxsidebar') as HTMLElement | null;
  if (!sidebar) {
    return;
  }
  fullscreenMenu = false;
  menuFold = false;
  refreshMenu();
  refreshFullscreenMenu();

  const sidebarWidth = sidebar.offsetWidth;
  if (sidebarWidth === 0) {
    console.warn('sidebar width is 0');
    return;
  }
  sidebar.style.setProperty('inset', '');
  widthMediaMatch = window.matchMedia(`(max-width: ${sidebarWidth * 2}px)`);
  widthMediaMatch.addEventListener('change', onWidthMediaChange);
  onWidthMediaChange();
}
window.refreshSidebarWidth = refreshSidebarWidth;
window.addEventListener('load', () => {
  initKsphinxMedia();
  refreshSidebarWidth();
  document.querySelectorAll('.highlight pre').forEach((ele) => {
    const codeEle = document.createElement('code');
    codeEle.innerHTML = ele.innerHTML;
    ele.innerHTML = '';
    ele.appendChild(codeEle);
  });
  hljs.highlightAll();
  const themeButton = document.getElementById('theme-button');
  const menuButton = {
    show: document.getElementById('menu-show-button'),
    hide: document.getElementById('menu-hide-button'),
  };
  const fullscreenButton = document.getElementById('menu-fullscreen-button');
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
  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
      menuFold = false;
      fullscreenMenu = !fullscreenMenu;
      refreshMenu();
      refreshFullscreenMenu();
    });
  }
  document.querySelectorAll('pre > code').forEach((ele) => {
    const parent = ele.parentElement;
    parent && parent.appendChild(createCopyButton(ele as HTMLElement));
  });
});
